namespace RamyScoolManagment.Api.Requests;

public class EnrollmentRequest
{
    public int StudentId { get; set; }
    public int GroupId { get; set; }
    public int InitialSessionsCount { get; set; } = 4;
    public DateTime? InitialSessionStartAt { get; set; }

    public DateTime ScheduledAt { get; set; }

    // Price (for paid sessions)
    public decimal? Price { get; set; }
}