using Npgsql;

namespace Overtake.Services;

/// <summary>
/// Service for initializing a new database by creating tables and constraints.
/// </summary>
public class DbInitService : BackgroundService
{
    private readonly ILogger<DbInitService> _logger;
    private readonly IConfiguration _configuration;

    private const int ATTEMPT_COUNT = 10;
    private const int CONNECTION_WATCH_BACKOFF = 500;

    public DbInitService(ILogger<DbInitService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connectionString = _configuration["Database"];
        if (connectionString is null)
        {
            throw new NullReferenceException("Postgres connection string not configured");
        }

        await using var dataSource = NpgsqlDataSource.Create(connectionString);
        await WaitForConnectionAsync(dataSource, stoppingToken);

        if (await IsDatabaseInitializedAsync(dataSource))
        {
            _logger.LogInformation("Database has already been initialized");
            return;
        }

        // Reads the embedded `Initialize.sql` resource file
        using var initScriptStream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream(
            "Overtake.Resources.Initialize.sql"
        );
        using var initScriptStreamReader = new StreamReader(initScriptStream!);
        var initScript = initScriptStreamReader.ReadToEnd();

        await using var cmd = dataSource.CreateCommand(initScript);
        await cmd.ExecuteNonQueryAsync();

        _logger.LogInformation("Database successfully initialized");
    }

    private async Task WaitForConnectionAsync(NpgsqlDataSource dataSource, CancellationToken stoppingToken)
    {
        _logger.LogDebug("Establishing database connection");
        for (int attempts = 0; attempts < ATTEMPT_COUNT && !stoppingToken.IsCancellationRequested; attempts++)
        {
            try
            {
                await using var _ = await dataSource.OpenConnectionAsync();
                _logger.LogDebug("Database connection successfully established");
                return;
            }
            catch
            {
                _logger.LogDebug("Database connection attempt #{} failed", attempts);
                await Task.Delay(CONNECTION_WATCH_BACKOFF);
            }
        }

        throw new Exception("Unable to establish database connection");
    }

    private async Task<bool> IsDatabaseInitializedAsync(NpgsqlDataSource dataSource)
    {
        _logger.LogDebug("Checking database initialization status");

        // Using table existence to check initialization status for simplicity. A more robust
        // solution would be to maintain a migration table.
        await using var cmd = dataSource.CreateCommand(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'"
        );
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var tableName = reader.GetString(0);
            if (tableName == "account")
            {
                return true;
            }
        }

        return false;
    }
}
