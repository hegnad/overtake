namespace Overtake.Models
{
    public class UserPoints
    {
        public required string Username {  get; set; }
        public required int TotalPoints { get; set; }
        public required int PointsThisSeason { get; set; }
        public required int HighestLeaguePoints { get; set; }
        public required string HighestLeagueName { get; set; }
    }
}