using Microsoft.Extensions.ObjectPool;

namespace Overtake.Models
{
    public class LeagueRoundDetails
    {
        public required int BallotId { get; set; }
        public required int UserId{ get; set; }
        public required string Username { get; set; }
        public required int? Score { get; set; }
    }
}
