using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Responses
{
    public class SessionResponse
    {
        public int Id { get; set; }
        public SessionType Type { get; set; }
        public DateTime ScheduledAt { get; set; }
        public decimal? Price { get; set; }
        public string GroupName { get; set; }
        public string TeacherName { get; set; }
        public bool IsAdditional { get; set; }
        public string DateSession { get; set; }
    }
}
