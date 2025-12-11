namespace RamyScoolManagment.Api.Responses;

public class GroupEnrollmentInfo
{
    public int GroupId { get; set; }
    public required string GroupName { get; set; }
    public int TeacherId { get; set; }
    public required string TeacherName { get; set; }
}