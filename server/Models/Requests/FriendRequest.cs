namespace Overtake.Models.Requests;

public class FriendRequest
{
    public required int InviteeId { get; set; }
    public required string Message { get; set; }
}
