namespace Overtake.Entities;

public class SimBallotContent
{
    public required int BallotId {  get; set; }
    public required DriverPrediction[] predictions { get; set; }
}
