namespace Overtake.Entities;

public class BallotDTO
{
    public required int BallotId { get; set; }
    public required int LeagueId { get; set; }
    public required int RaceId { get; set; }
    public required int UserId { get; set; }
    public required DateTime CreateTime { get; set; }
    public DateTime? SettleTime { get; set; }
    public int? Score { get; set; }
    public List<string> DriverPredictions { get; set; } = new(); // Ordered list of driver names
}
