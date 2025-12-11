        namespace RamyScoolManagment.Api.Responses
{
    public class PresenceInfo
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public required string Status { get; set; }
        public DateTime ScheduledAt { get; set; }
        public string? Notes { get; set; }
    }
}