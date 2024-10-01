using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities;

[Route("api/ballot")]
[ApiController]
public class BallotController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<BallotController> _logger;

    public BallotController(IDatabase database, ILogger<BallotController> logger)
    {
        _database = database;
        _logger = logger;
    }

    [HttpPost]
    [Route("create")]
    [Produces("application/json")]
    public async Task<ActionResult> CreateAsync([FromBody] CreateBallotRequest request)
    {
        // Validate request
        if (request.DriverPredictions == null || request.DriverPredictions.Count != 10)
        {
            return new BadRequestResult();
        }

        // Get current user ID
        int userId = Convert.ToInt32(HttpContext.User.Claims.First(x => x.Type == "userId").Value);

        // Call the InsertBallotAsync method
        int newBallotId = await _database.InsertBallotAsync(userId, request.LeagueId, request.RaceId, request.DriverPredictions);

        return new OkObjectResult(new { BallotId = newBallotId });
    }
}