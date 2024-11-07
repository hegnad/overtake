namespace Overtake.Models
{
    public class FriendRequestInfo
    {
        public required int InviteId {  get; set; }
        public required int InitiatorId { get; set; }
        public required string InitiatorUsername {  get; set; }
    }
}
