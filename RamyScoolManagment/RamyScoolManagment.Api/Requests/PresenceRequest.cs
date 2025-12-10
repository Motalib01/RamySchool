namespace RamyScoolManagment.Api.Requests
{
    public class PresenceRequest
    {
        public int StudentId { get; set; }
        public int SessionId { get; set; }
        public bool IsPresent { get; set; }
    }
}
