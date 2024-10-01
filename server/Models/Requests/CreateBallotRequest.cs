namespace Overtake.Models.Requests;

public class CreateBallotRequest
{
    public required int RaceId { get; set; } // User selects the race
    public required int LeagueId { get; set; } // User selects or belongs to a league
    public required List<string> DriverPredictions { get; set; } // List of 10 driver IDs representing the user's predictions
}