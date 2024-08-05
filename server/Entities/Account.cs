namespace Overtake.Entities;

public class Account
{
    public required int AccountId { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required byte[] PasswordHash { get; set; }
}
