namespace Overtake.Models.Requests;

public class LeagueInviteRequest
{
    public required int LeagueId { get; set; }
    public required int InviteeId { get; set; }
}
