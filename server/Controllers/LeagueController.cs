using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks.Dataflow;
using System.Reflection.Metadata.Ecma335;


/// <summary>
/// API related to league operations.
/// </summary>
[Authorize]
[Route("api/league")]
[ApiController]
public class LeagueController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<LeagueController> _logger;

    public LeagueController(IDatabase database, ILogger<LeagueController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new race league
    /// </summary>
    [HttpPost]
    [Route("create")]
    [Produces("application/json")]
    public async Task<ActionResult<RaceLeagueInfo>> CreateAsync([FromBody] CreateLeagueRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new BadRequestResult();
        }

        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var account = await _database.GetAccountByIdAsync(userId);

        int newLeagueId = await _database.InsertLeagueAsync(account.AccountId, request.Name, request.IsPublic);

        int membership = await _database.InsertLeagueMembershipAsync(newLeagueId, account.AccountId);

        return new OkObjectResult(new RaceLeagueInfo {LeagueId = newLeagueId, OwnerId = account.AccountId, Name = request.Name, IsPublic = request.IsPublic});
    }

    [HttpPut]
    [Route("updateLeagueDetails")]
    [Produces("application/json")]
    public async Task<IActionResult> UpdateLeagueDetailsAsync([FromBody] UpdateLeagueRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { Message = "Invalid input. League name must be provided." });
        }

        var isUpdated = await _database.UpdateLeagueDetailsAsync(request);

        if (isUpdated)
        {
            return Ok(new { Message = "League details updated successfully." });
        }
        else
        {
            return NotFound(new { Message = $"League with ID {request.LeagueId} not found." });
        }
    }

    [HttpGet]
    [Route("getLeagueById")]
    [Produces("application/json")]
    public async Task<ActionResult<RaceLeague>> GetLeagueByIdAsync([FromQuery] int leagueId)
    {
        var league = await _database.GetLeagueByIdAsync(leagueId);

        return new OkObjectResult(league);
    }

    [HttpGet]
    [Route("populate")]
    [Produces("application/json")]
    public async Task<ActionResult<RaceLeagueInfo[]>> PopulateAsync()
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        RaceLeagueInfo[] leagues = await _database.PopulateLeaguesAsync(userId);

        return new OkObjectResult(leagues);
    }

    [HttpGet]
    [Route("populatepublic")]
    [Produces("application/json")]
    public async Task<ActionResult<RaceLeagueInfo[]>> PopulatePublicAsync()
    {
        RaceLeagueInfo[] leagues = await _database.GetPublicLeagues();

        return new OkObjectResult(leagues);
    }

    [HttpPost]
    [Route("join")]
    [Produces("application/json")]
    public async Task<ActionResult<int>> JoinLeagueAsync([FromBody] JoinLeagueRequest request)
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var account = await _database.GetAccountByIdAsync(userId);

        int membership = await _database.InsertLeagueMembershipAsync(request.leagueId, account.AccountId);

        return new OkObjectResult(membership);
    }

    [HttpGet]
    [Route("populateDetails")]
    [Produces("application/json")]
    public async Task<ActionResult<Member[]>> PopulateLeagueDetailsAsync([FromQuery] int leagueId)
    {
        var members = await _database.GetLeagueDetailsAsync(leagueId);
        return new OkObjectResult(members);
    }

    [HttpPost]
    [Route("join/{invite}")]
    [Produces("application/json")]
    public async Task<ActionResult<RaceLeagueInfo>> JoinLeagueInvite(string invite)
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
        var joinLeague = await _database.JoinLeagueAsyncByInvite(invite, userId);

        return new OkObjectResult(joinLeague);

    }

    [HttpPost]
    [Route("invite")]
    [Produces("application/json")]
    public async Task<ActionResult<int>> CreateLeagueInviteAsync([FromBody] LeagueInviteRequest request)
    {

        int leagueInvite = await _database.CreateLeagueInvite(request);

        return new OkObjectResult(leagueInvite);
    }

    [HttpGet]
    [Route("populateInvites")]
    [Produces("application/json")]
    public async Task<ActionResult<LeagueInviteInfo[]>> PopulateLeagueInvitesAsync()
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var leagueInvites = await _database.GetLeagueInvites(userId);

        return new OkObjectResult(leagueInvites);
    }

    [HttpPost]
    [Route("updateStatus")]
    [Produces("application/json")]
    public async Task<IActionResult> UpdateLeagueInviteStatusAsync([FromBody] UpdateStatusRequest request)
    {
        await _database.UpdateLeagueInviteStatus(request.InviteId, request.Status);

        return Ok();
    }

    [HttpGet]
    [Route("getLeagueName")]
    [Produces("application/json")]
    public async Task<ActionResult<string>> GetLeagueNameAsync(int leagueId)
    {
        var league = await _database.GetLeagueByIdAsync(leagueId);

        if (league == null)
        {
            return NotFound("League not found");
        }

        return Ok(league.Name);
    }

    [HttpGet]
    [Route("getLeagueRoundDetails")]
    [Produces("application/json")]
    public async Task<ActionResult<LeagueRoundDetails[]>> GetRoundDetailsAsync([FromQuery] int leagueId, [FromQuery] int raceId)
    {
        var details = await _database.GetLeagueRoundDetails(leagueId, raceId);

        return new OkObjectResult(details);
    }

    [HttpGet]
    [Route("isUserLeagueOwner")]
    [Produces("application/json")]
    public async Task<ActionResult<bool>> IsUserLeagueOwnerAsync([FromQuery] int leagueId)
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var isOwner = await _database.IsUserLeagueOwner(userId, leagueId);

        return new OkObjectResult(isOwner);
    }

    [HttpGet]
    [Route("getJoinCode")]
    [Produces("application/json")]
    public async Task<ActionResult<string>> getLeagueJoinCodeAsync([FromQuery] int leagueId)
    {
        var inviteCode = await _database.getLeagueJoinCode(leagueId);

       return new OkObjectResult(inviteCode);
    }
}
