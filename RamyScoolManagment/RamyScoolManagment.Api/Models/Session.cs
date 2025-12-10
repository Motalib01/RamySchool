using System;
using System.Collections.Generic;

namespace RamyScoolManagment.Api.Models
{
    public class Session
    {
        public int Id { get; set; }

        // Session is tied to a specific Enrollment (a student in a group)
        public int EnrollmentId { get; set; }

        public DateTime ScheduledAt { get; set; }

        // Free or Paid
        public SessionType Type { get; set; } = SessionType.Free;

        // Optional fee for paid sessions
        public decimal? Fee { get; set; }

        // Flag to indicate sessions added beyond the default set
        public bool IsAdditional { get; set; } = false;

        // Which teacher created/added this session (useful if multiple teachers or auditing)
        public int CreatedByTeacherId { get; set; }

        public virtual Enrollment Enrollment { get; set; }

        // Each session has presences (status pending/present/absent)
        public virtual ICollection<Presence> Presences { get; set; } = new List<Presence>();
    }
}