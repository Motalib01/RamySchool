using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Responses
{
    public class AttendanceResponse
    {
        public int AttendanceId { get; set; }
        public int SessionId { get; set; }
        public SessionType SessionType { get; set; }
        public PresenceStatus PresenceStatus { get; set; } 
        public int StudentId { get; set; }
    }
}
