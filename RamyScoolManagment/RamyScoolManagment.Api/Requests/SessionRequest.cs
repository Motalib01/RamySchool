using System;

namespace RamyScoolManagment.Api.Requests
{
    public class SessionRequest
    {
        public int Type { get; set; }
        public DateTime ScheduledAt { get; set; }
        public decimal? Price { get; set; }
    }
}
