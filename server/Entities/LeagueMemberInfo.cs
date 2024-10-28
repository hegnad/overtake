namespace Overtake.Entities;

public class LeagueMemberInfo
{
    public required int LeagueId { get; set; }
    public required int UserId { get; set; }
    public required string Name {  get; set; }
}