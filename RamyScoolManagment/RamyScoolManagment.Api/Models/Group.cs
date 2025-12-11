using System.Collections.Generic;

namespace RamyScoolManagment.Api.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TeacherId { get; set; }

        public virtual Teacher Teacher { get; set; }

        // Students are connected through Enrollment (many-to-many with payload)
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        
        // Group-level sessions that all students share
        public virtual ICollection<Session> Sessions { get; set; } = new List<Session>();
    }
}