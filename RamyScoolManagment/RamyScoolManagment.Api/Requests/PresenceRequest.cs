using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Requests
{
    public class PresenceRequest
    {
        public int StudentId { get; set; }
        public int SessionId { get; set; }
        public PresenceStatus Status { get; set; }
    }
}
