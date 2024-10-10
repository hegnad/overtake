using System.Security.Cryptography;
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
    public async Task<ActionResult<int>> CreateAsync([FromBody] CreateBallotRequest request)
    {

        // Validate request
        if (request.DriverPredictions == null || request.DriverPredictions.Count != 10)
        {
            return new BadRequestResult();
        }

        // Get current user ID
        int userId = Convert.ToInt32(HttpContext.User.Claims.First(x => x.Type == "userId").Value);

        int leagueId = 1;
        int raceId = 1;

        // Create a list of DriverPrediction objects
        var driverPredictions = request.DriverPredictions.Select((name, index) => new DriverPrediction
        {
            DriverName = name,
            Position = index + 1 // Assuming the positions are 1-based
        }).ToList();

        // Call the InsertBallotAsync method
        int newBallotId = await _database.InsertBallotAsync(userId, leagueId, raceId, driverPredictions);

        return new OkObjectResult(newBallotId);
    }

    [HttpGet]
    [Route("populate")]
    [Produces("application/json")]
    public async Task<ActionResult<BallotContent[]>> PopulateAync()
    {
        int userId = Convert.ToInt32(HttpContext.User.Claims.First(x => x.Type == "userId").Value);
        int? ballotId = await _database.GetBallotByUserIdAsync(userId);

        if (ballotId == null)
        {
            return NotFound();
        }

        BallotContent[] ballot = await _database.GetBallotContentAsync(ballotId.Value);

        if (ballot == null || ballot.Length == 0)
        {
            return Ok(new BallotContent[0]);
        }

        return new OkObjectResult(ballot);
    }
}



