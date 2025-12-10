using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class AttendanceEndpoints
    {
        public static void MapAttendanceEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/attendance")
                .WithTags("Attendance")
                .WithOpenApi();

            group.MapPost("/", UpdateAttendance).WithName("UpdateAttendance");
        }

        private static async Task<IResult> UpdateAttendance(ApplicationDbContext db, PresenceRequest req)
        {
            var presence = await db.Presences
                .Include(p => p.Session)
                    .ThenInclude(s => s.Enrollment)
                        .ThenInclude(e => e.Group)
                .FirstOrDefaultAsync(p => p.SessionId == req.SessionId && p.StudentId == req.StudentId);
            
            if (presence is null) return Results.NotFound("Presence record not found.");

            presence.Status = req.IsPresent ? PresenceStatus.Present : PresenceStatus.Absent;
            presence.RecordedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            var student = await db.Students.FindAsync(presence.StudentId);

            var presenceResp = new PresenceResponse
            {
                Id = presence.Id,
                StudentName = student?.Name ?? "",
                GroupName = presence.Session?.Enrollment?.Group?.Name ?? "",
                SessionDate = presence.Session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                PresenceStatus = presence.Status
            };

            return Results.Ok(presenceResp);
        }
    }
}
