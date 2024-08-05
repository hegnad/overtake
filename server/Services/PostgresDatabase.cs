using Npgsql;
using Overtake.Entities;
using Overtake.Interfaces;

namespace Overtake.Services;

public class PostgresDatabase : IDatabase
{
    private readonly NpgsqlDataSource _dataSource;
    private readonly ILogger<PostgresDatabase> _logger;

    public PostgresDatabase(ILogger<PostgresDatabase> logger, IConfiguration configuration)
    {
        _logger = logger;

        var connectionString = configuration["Database"];
        if (connectionString is null)
        {
            throw new NullReferenceException("Postgres connection string not configured");
        }

        _dataSource = NpgsqlDataSource.Create(connectionString);
    }

    public async Task<int> InsertAccountAsync(string username, string firstName, string lastName, string email, byte[] passwordHash)
    {
        await using var cmd = _dataSource.CreateCommand(
            @"INSERT INTO account (username, first_name, last_name, email, password_hash)
                VALUES (@username, @first_name, @last_name, @email, @password_hash)
                RETURNING account_id"
        );

        cmd.Parameters.AddWithValue("username", username);
        cmd.Parameters.AddWithValue("first_name", firstName);
        cmd.Parameters.AddWithValue("last_name", lastName);
        cmd.Parameters.AddWithValue("email", email);
        cmd.Parameters.AddWithValue("password_hash", passwordHash);

        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();
        int newAccountId = reader.GetInt32(0);

        return newAccountId;
    }

    public async Task<Account> GetAccountByIdAsync(int accountId)
    {
        await using var cmd = _dataSource.CreateCommand(
            @"SELECT username, first_name, last_name, email, password_hash FROM account
                WHERE account_id=@account_id"
        );

        cmd.Parameters.AddWithValue("account_id", accountId);

        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();

        byte[] passwordHash = new byte[32];
        reader.GetBytes(4, 0, passwordHash, 0, passwordHash.Length);

        return new Account
        {
            AccountId = accountId,
            Username = reader.GetString(0),
            FirstName = reader.GetString(1),
            LastName = reader.GetString(2),
            Email = reader.GetString(3),
            PasswordHash = passwordHash,
        };
    }

    public async Task<Account> GetAccountByUsernameAsync(string username)
    {
        await using var cmd = _dataSource.CreateCommand(
            @"SELECT account_id, first_name, last_name, email, password_hash FROM account
                WHERE username=@username"
        );

        cmd.Parameters.AddWithValue("username", username);

        await using var reader = await cmd.ExecuteReaderAsync();

        await reader.ReadAsync();

        byte[] passwordHash = new byte[32];
        reader.GetBytes(4, 0, passwordHash, 0, passwordHash.Length);

        return new Account
        {
            AccountId = reader.GetInt32(0),
            Username = username,
            FirstName = reader.GetString(1),
            LastName = reader.GetString(2),
            Email = reader.GetString(3),
            PasswordHash = passwordHash,
        };

    }
}
