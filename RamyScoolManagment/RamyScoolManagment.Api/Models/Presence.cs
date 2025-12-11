        using System;

namespace RamyScoolManagment.Api.Models
{
    public class Presence
    {
        public int Id { get; set; }

        // Which session this presence record belongs to
        public int SessionId { get; set; }

        // Redundant but convenient for queries: which student
        public int StudentId { get; set; }

        // Default is Pending; can become Present or Absent
        public PresenceStatus Status { get; set; } = PresenceStatus.Pending;

        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

        public string? Notes { get; set; }

        public virtual Session Session { get; set; }
        public virtual Student Student { get; set; }
    }

}