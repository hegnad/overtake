namespace Overtake.Models.Requests
{
    public class UpdateStatusRequest
    {
        public required int InviteId {  get; set; }
        public required int Status { get; set; }
    }
}
