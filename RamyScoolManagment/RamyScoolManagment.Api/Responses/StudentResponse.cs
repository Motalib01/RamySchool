using System.Collections.Generic;

namespace RamyScoolManagment.Api.Responses
{
    public class StudentResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        // Provide group membership details
        public List<GroupEnrollmentInfo> Enrollments { get; set; } = new List<GroupEnrollmentInfo>();

        public List<PresenceResponse> Presences { get; set; } = new List<PresenceResponse>();
    }

    public class GroupEnrollmentInfo
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; }
    }
}
