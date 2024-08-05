using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
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
    [Produces("application/json")]
    public async Task<ActionResult<Session>> RegisterAsync([FromBody] RegisterRequest request)
    {
        _logger.LogTrace(
            "Registration request: username={0}, firstname={1}, lastname={2}, email={3}",
            request.Username,
            request.FirstName,
            request.LastName,
            request.Email
        );

        if (string.IsNullOrWhiteSpace(request.Username)
            || string.IsNullOrWhiteSpace(request.FirstName)
            || string.IsNullOrWhiteSpace(request.LastName)
            || string.IsNullOrWhiteSpace(request.Email)
            || string.IsNullOrWhiteSpace(request.Password))
        {
            return new BadRequestResult();
        }

        // TODO: check email/username existence

        using var sha256 = SHA256.Create();
        byte[] passwordHash = sha256.ComputeHash(Encoding.ASCII.GetBytes("overtake|" + request.Password));

        int newUserId = await _database.InsertAccountAsync(request.Username, request.FirstName, request.LastName, request.Email, passwordHash);

        // Mock session token with just the account ID
        return new OkObjectResult(new Session
        {
            Token = newUserId.ToString(),
        });
    }

    /// <summary>
    /// Creates a new session for an account by logging in.
    /// </summary>
    [HttpPost]
    [Route("login")]
    [Produces("application/json")]
    public async Task<ActionResult<Session>> LoginAsync([FromBody] LoginRequest request)
    {
        _logger.LogTrace(
            "Login request: username={0}",
            request.Username
        );

        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return new BadRequestResult();
        }

        using var sha256 = SHA256.Create();
        byte[] requestPasswordHash = sha256.ComputeHash(Encoding.ASCII.GetBytes("overtake|" + request.Password));

        var account = await _database.GetAccountByUsernameAsync(request.Username);
        if (!requestPasswordHash.SequenceEqual(account.PasswordHash))
        {
            return new BadRequestResult();
        }

        // Mock session token with just the account ID
        return new OkObjectResult(new Session
        {
            Token = account.AccountId.ToString(),
        });
    }

    /// <summary>
    /// Gets account information.
    /// </summary>
    [HttpGet]
    [Route("info")]
    [Produces("application/json")]
    public async Task<AccountInfo> InfoAsync()
    {
        int userId = Convert.ToInt32(HttpContext.User.Claims.First(x => x.Type == "userId").Value);

        var account = await _database.GetAccountByIdAsync(userId);

        return new AccountInfo
        {
            Username = account.Username,
        };
    }
}
