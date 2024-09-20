using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities

/// <summary>
/// API related to league operations.
/// </summary>
[Route("api/league")]
[ApiController]
public class LeagueController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IDatabase database, ILogger<AccountController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new race league
    /// </summary>
    [HttpPost]
    [Route("register")]]
    [Produces("application/json")]
    public async Task<RaceLeague> RegisterAsync([FromBody] CreateLeaugueRequest request)
    {
        if (int.IsNullOrWhiteSpace(request.OwnerId)
            || string.IsNullOrWhiteSpace(request.Name)
            || bool.IsNullOrEmpty(request.IsPublic)
            ) 
        {
            return new BadRequestResult();
        }

        int newLeagueId = await._database.InsertLeagueAsync(request.OwnerId, request.Name, request.IsPublic);
    }
}
