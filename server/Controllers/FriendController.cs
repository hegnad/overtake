using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Overtake.Interfaces;
using Overtake.Models;
using Overtake.Models.Requests;
using Overtake.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


[Authorize]
[Route("api/friend")]
[ApiController]
public class FriendController : ControllerBase
{
    private readonly IDatabase _database;
    private readonly ILogger<FriendController> _logger;

    public FriendController(IDatabase database, ILogger<FriendController> logger)
    {
        _database = database;
        _logger = logger;
    }

    [HttpPost]
    [Route("createRequest")]
    [Produces("application/json")]
    public async Task<ActionResult<int>> CreateRequestAsync([FromBody] FriendRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return new BadRequestResult();
        }
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        try
        {
            int newRequestId = await _database.InsertFriendRequest(userId, request);
            return new OkObjectResult(newRequestId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while inserting friend request");
            return StatusCode(500, "An error occurred while processing the request");
        }
    }

    [HttpGet]
    [Route("populate")]
    [Produces("application/json")]
    public async Task<ActionResult<FriendInfo[]>> PopulateFriendsAsync()
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var friends = await _database.GetFriends(userId);

        if (friends == null | friends.Length == 0)
        {
            return NotFound("No friends found for this user.");
        }

        return new OkObjectResult(friends);

    }

    [HttpGet]
    [Route("populateRequests")]
    [Produces("application/json")]
    public async Task<ActionResult<FriendRequestInfo[]>> PopulateRequestsAsync()
    {
        int userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var friendRequests = await _database.GetFriendRequests(userId);

        if (friendRequests == null | friendRequests.Length == 0)
        {
            return NotFound("No friend requests for this user.");
        }

        return new OkObjectResult(friendRequests);
    }

    [HttpGet]
    [Route("populateUsers")]
    [Produces("application/json")]
    public async Task<ActionResult<UserInfo[]>> PopulateUserAsync()
    {
        var users = await _database.PopulateUsers();

        if (users == null  | users.Length == 0)
        {
            return NotFound("No users in database.");
        }

        return new OkObjectResult(users);
    }

    [HttpPut]
    [Route("updateStatus")]
    [Produces("application/json")]
    public async Task<IActionResult> UpdateFriendInviteStatusAsync([FromBody] UpdateStatusRequest request)
    {
        await _database.UpdateFriendInviteStatus(request.InviteId, request.Status);

        return Ok();
    }
}