using System;
using System.Collections.Generic;

namespace RamyScoolManagment.Api.Models
{
    // Join entity for Student <-> Group with enrollment metadata and per-enrollment sessions
    public class Enrollment
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int GroupId { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        // When a student is added to a group they receive these many default sessions
        public int InitialSessionsCount { get; set; } = 4;

        public Student Student { get; set; }
        public Group Group { get; set; }

        // Sessions created for this particular student in this group (teacher may add additional ones)
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
    }
}