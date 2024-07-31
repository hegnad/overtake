namespace Overtake.Interfaces;

public interface IDatabase
{
    Task InsertAccountAsync(string username, string firstName, string lastName, string email, string password);
}
