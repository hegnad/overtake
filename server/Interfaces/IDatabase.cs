using Overtake.Entities;

namespace Overtake.Interfaces;

public interface IDatabase
{
    Task<int> InsertAccountAsync(string username, string firstName, string lastName, string email, string password);

    Task<Account> GetAccountAsync(int accountId);
}
