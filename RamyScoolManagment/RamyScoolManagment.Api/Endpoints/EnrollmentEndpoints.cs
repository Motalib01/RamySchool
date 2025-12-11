using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class EnrollmentEndpoints
    {
        public static void MapEnrollmentEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/enrollments")
                .WithTags("Enrollments")
                .WithOpenApi();

            group.MapPost("/", CreateEnrollment).WithName("CreateEnrollment");
        }

        private static async Task<IResult> CreateEnrollment(ApplicationDbContext db, EnrollmentRequest req)
        {
            var student = await db.Students.FindAsync(req.StudentId);
            if (student is null) return Results.BadRequest($"Student {req.StudentId} not found.");

            var group = await db.Groups
                .Include(g => g.Teacher)
                .Include(g => g.Sessions)
                .FirstOrDefaultAsync(g => g.Id == req.GroupId);
            if (group is null) return Results.BadRequest($"Group {req.GroupId} not found.");

            var exists = await db.Enrollments.AnyAsync(e => e.StudentId == req.StudentId && e.GroupId == req.GroupId);
            if (exists) return Results.Conflict("Student already enrolled in this group.");

            var enrollment = new Enrollment
            {
                StudentId = req.StudentId,
                GroupId = req.GroupId,
                EnrolledAt = DateTime.UtcNow
            };

            db.Enrollments.Add(enrollment);
            await db.SaveChangesAsync();

            // Create presences for all existing group sessions
            foreach (var session in group.Sessions)
            {
                var presence = new Presence
                {
                    SessionId = session.Id,
                    StudentId = student.Id,
                    Status = PresenceStatus.Pending,
                    RecordedAt = DateTime.UtcNow
                };
                db.Presences.Add(presence);
            }

            await db.SaveChangesAsync();

            return Results.Created($"/api/enrollments/{enrollment.Id}", new { enrollment.Id, enrollment.StudentId, enrollment.GroupId });
        }
    }
}
