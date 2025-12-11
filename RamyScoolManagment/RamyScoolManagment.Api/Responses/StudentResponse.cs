namespace RamyScoolManagment.Api.Responses;

public class StudentResponse
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string PhoneNumber { get; set; }

    // Provide group membership details
    public List<GroupEnrollmentInfo> Enrollments { get; set; } = new List<GroupEnrollmentInfo>();

    public List<PresenceResponse> Presences { get; set; } = new List<PresenceResponse>();
}



