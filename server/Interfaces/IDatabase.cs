using Overtake.Entities;

namespace Overtake.Interfaces;

public interface IDatabase
{
    Task<int> InsertAccountAsync(string username, string firstName, string lastName, string email, byte[] passwordHash);

    Task<Account> GetAccountByIdAsync(int accountId);

    Task<Account> GetAccountByUsernameAsync(string username);
}
