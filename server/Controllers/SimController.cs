using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/sim")]
[ApiController]
public class SimController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<BallotController> _logger;

    public SimController(IDatabase database, ILogger<BallotController> logger)
    {
        _database = database;
        _logger = logger;
    }

    [HttpPost]
    [Route("create")]
    [Produces("application/json")]
    public async Task<ActionResult<int>> CreateAsync([FromBody] CreateSimBallotRequest request)
    {
        var driverPredictions = request.DriverPredictions.Select((name, index) => new DriverPrediction
        {
            DriverName = name,
            Position = index + 1
        }).ToList();

        string username = request.Username;

        int newSimBallotId = await _database.InsertSimBallotAsync(username, driverPredictions);

        return new OkObjectResult(newSimBallotId);
    }

    [HttpGet]
    [Route("populateunscored")]
    [Produces("application/json")]
    public async Task<ActionResult<SimBallotContent[]>> PopulateUnscoredBallotsAsync()
    {
        var pendingSimBallots = await _database.PopulateUnscoredBallots();

        if (pendingSimBallots.Length == 0)
        {
            return NoContent(); // Return HTTP 204 if no data is found
        }

        return new OkObjectResult(pendingSimBallots);
    }

    [HttpPut]
    [Route("updatescores")]
    public async Task<IActionResult> UpdateScores([FromBody] UpdateSimScoreRequest request)
    {
        if (request == null || request.BallotId <= 0 || request.Score < 0)
        {
            return BadRequest("Invalid request payload.");
        }

        // Process the update logic here
        var success = await _database.UpdateSimBallotScoresAsync(request.BallotId, request.Score);

        if (!success)
        {
            return BadRequest("Failed to update the score.");
        }

        return Ok("Score updated successfully.");
    }

    [HttpGet]
    [Route("leaderboard")]
    [Produces("application/json")]
    public async Task<ActionResult<SimLeaderboard[]>> GetLeaderboardAsync()
    {
       var leaderboard = await _database.GetSimLeaderboard();

        return new OkObjectResult(leaderboard);
    }
}