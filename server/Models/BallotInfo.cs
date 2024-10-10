namespace Overtake.Models
{
	public class BallotInfo
	{
		public required int BallotId { get; set; }
		public required int LeagueId { get; set; }
		public required int RaceId { get; set; }
		public required int UserId { get; set; }

		/*
		 * ChatGPT generated property
		 * 
		 * Prompt: How to add a time/date property into my C# class
		 * Result:
		 */

		public required DateTime CreateTime { get; set; }
		public int? Score { get; set; }

	}
}