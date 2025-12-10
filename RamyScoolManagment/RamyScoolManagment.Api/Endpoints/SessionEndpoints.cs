using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class SessionEndpoints
    {
        public static void MapSessionEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/sessions")
                .WithTags("Sessions")
                .WithOpenApi();

            group.MapGet("/", GetAllSessions).WithName("GetAllSessions");
            group.MapGet("/{id}", GetSessionById).WithName("GetSessionById");
            group.MapGet("/student/{studentId}", GetStudentSessions).WithName("GetStudentSessions");
            group.MapDelete("/{id}", DeleteSession).WithName("DeleteSession");
        }

        private static async Task<IResult> GetAllSessions(ApplicationDbContext db)
        {
            var sessions = await db.Sessions
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Group)
                        .ThenInclude(g => g.Teacher)
                .ToListAsync();

            var response = sessions.Select(s => new SessionResponse
            {
                Id = s.Id,
                Type = s.Type,
                ScheduledAt = s.ScheduledAt,
                Price = s.Fee,
                GroupName = s.Enrollment?.Group?.Name ?? "",
                TeacherName = s.Enrollment?.Group?.Teacher?.FullName ?? "",
                IsAdditional = s.IsAdditional
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> GetSessionById(ApplicationDbContext db, int id)
        {
            var session = await db.Sessions
                .Include(s => s.Enrollment)
                    .ThenInclude(e => e.Group)
                        .ThenInclude(g => g.Teacher)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session is null) return Results.NotFound();

            var response = new SessionResponse
            {
                Id = session.Id,
                Type = session.Type,
                ScheduledAt = session.ScheduledAt,
                Price = session.Fee,
                GroupName = session.Enrollment?.Group?.Name ?? "",
                TeacherName = session.Enrollment?.Group?.Teacher?.FullName ?? "",
                IsAdditional = session.IsAdditional
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> GetStudentSessions(ApplicationDbContext db, int studentId)
        {
            var presences = await db.Presences
                .Where(p => p.StudentId == studentId)
                .Include(p => p.Session)
                .ToListAsync();

            if (!presences.Any()) return Results.Ok(new List<AttendanceResponse>());

            var response = presences.Select(p => new AttendanceResponse
            {
                AttendanceId = p.Id,
                SessionId = p.Session.Id,
                SessionType = p.Session.Type,
                PresenceStatus = p.Status,
                StudentId = p.StudentId
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> DeleteSession(ApplicationDbContext db, int id)
        {
            var session = await db.Sessions.FindAsync(id);
            if (session is null) return Results.NotFound();

            db.Sessions.Remove(session);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }
    }
}
