using System;
using System.Collections.Generic;

namespace RamyScoolManagment.Api.Models
{
    // Join entity for Student <-> Group with enrollment metadata
    public class Enrollment
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int GroupId { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        public Student Student { get; set; }
        public Group Group { get; set; }
    }
}