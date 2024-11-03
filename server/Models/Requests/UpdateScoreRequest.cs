namespace Overtake.Models.Requests;

public class UpdateScoreRequest
{
    public int LeagueId { get; set; }
    public int RaceId { get; set; }
    public int Score { get; set; }
}