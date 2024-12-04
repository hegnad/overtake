using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities;


[Route("api/images")]
[ApiController]
public class DriverImageController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<DriverImageController> _logger;

    public DriverImageController(IDatabase database, ILogger<DriverImageController> logger)
    {
        _database = database;
        _logger = logger;
    }

    [HttpGet]
    [Route("populate")]
    [Produces("application/json")]
    public async Task<ActionResult<Driver[]>> PopulateAsync()
    {
        Driver[] drivers = await _database.PopulateDriversAsync();
        return new OkObjectResult(drivers);
    }

    [HttpGet]
    [Route("driver/headshot/{driverNumber}")]
    [Produces("application/json")]
    public async Task<ActionResult<string>> GetDriverHeadshotAsync(int driverNumber)
    {
        var driverMetadata = await _database.GetDriverMetadataByNumberAsync(driverNumber);

        if (driverMetadata == null)
        {
            return NotFound();
        }

        // Return the relative path to the driver's headshot
        return new OkObjectResult(driverMetadata.HeadshotPath);
    }

    [HttpGet]
    [Route("all/{driverNumber}")]
    [Produces("application/json")]
    public async Task<ActionResult<Driver>> GetDriverMetadataByNumberAsync(int driverNumber)
    {
        var driverMetadata = await _database.GetDriverMetadataByNumberAsync(driverNumber);

        if (driverMetadata == null)
        {
            return NotFound();
        }

        return new OkObjectResult(driverMetadata);
    }

    [HttpGet]
    [Route("track/{roundNumber}")]
    [Produces("application/json")]
    public async Task<ActionResult<Track>> GetTrackDataByRoundAsync(int roundNumber)
    {
        // Get the list of drivers for the given round
        var trackData = await _database.GetTrackDataByRoundAsync(roundNumber);

        if (trackData == null)
        {
            return NotFound();
        }

        return new OkObjectResult(trackData.ImagePath);
    }

    [HttpGet]
    [Route("team/{constructorId}")]
    [Produces("application/json")]
    public async Task<ActionResult<Team>> GetTeamMetadataByIdAsync(string constructorId)
    {
        var teamMetadata = await _database.GetTeamMetadataByIdAsync(constructorId);

        if (teamMetadata == null)
        {
            return NotFound();
        }

        return new OkObjectResult(teamMetadata);
    }

}
