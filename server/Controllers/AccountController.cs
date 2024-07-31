using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models.Requests;

namespace Overtake.Controllers;

/// <summary>
/// API related to account operations.
/// </summary>
[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IDatabase database, ILogger<AccountController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new account.
    /// </summary>
    [HttpPost]
    [Route("register")]
    public async Task Register([FromBody] RegisterRequest request)
    {
        _logger.LogTrace(
            "Registration request: username={0}, firstname={1}, lastname={2}, email={3}",
            request.Username,
            request.FirstName,
            request.LastName,
            request.Email
        );

        // TODO: input validation
        // TODO: check email/username existence

        await _database.InsertAccountAsync(request.Username, request.FirstName, request.LastName, request.Email, request.Password);
    }
}
