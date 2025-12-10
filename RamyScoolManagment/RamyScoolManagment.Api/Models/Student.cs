using System.Collections.Generic;

namespace RamyScoolManagment.Api.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        // A student can belong to multiple groups via Enrollment (many-to-many with payload)
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

        // Presence records for this student across sessions
        public virtual ICollection<Presence> Presences { get; set; } = new List<Presence>();
    }
}