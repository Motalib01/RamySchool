using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class PresencesEndpoints
    {
        public static void MapPresencesEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/presences")
                .WithTags("Presences")  // Changed from WithName to WithTags
                .WithOpenApi();

            group.MapGet("/", GetAllPresences).WithName("GetAllPresences");
            group.MapGet("/{id}", GetPresenceById).WithName("GetPresenceById");
            group.MapPost("/", CreatePresence).WithName("CreatePresence");
            group.MapPut("/{id}", UpdatePresence).WithName("UpdatePresence");
            group.MapDelete("/{id}", DeletePresence).WithName("DeletePresence");
        }

        private static async Task<IResult> GetAllPresences(ApplicationDbContext db)
        {
            var presences = await db.Presences
                .Include(p => p.Session)
                    .ThenInclude(s => s.Group)
                .Include(p => p.Student)
                .ToListAsync();

            var response = presences.Select(p => new PresenceResponse
            {
                Id = p.Id,
                StudentName = p.Student?.Name ?? "",
                GroupName = p.Session?.Group?.Name ?? "",
                SessionDate = p.Session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                PresenceStatus = p.Status
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> GetPresenceById(ApplicationDbContext db, int id)
        {
            var presence = await db.Presences
                .Include(p => p.Session)
                    .ThenInclude(s => s.Group)
                .Include(p => p.Student)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (presence is null) return Results.NotFound();

            var response = new PresenceResponse
            {
                Id = presence.Id,
                StudentName = presence.Student?.Name ?? "",
                GroupName = presence.Session?.Group?.Name ?? "",
                SessionDate = presence.Session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                PresenceStatus = presence.Status
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> CreatePresence(ApplicationDbContext db, PresenceRequest req)
        {
            var presence = new Presence
            {
                StudentId = req.StudentId,
                SessionId = req.SessionId,
                Status = req.Status,
                RecordedAt = DateTime.UtcNow
            };

            db.Presences.Add(presence);
            await db.SaveChangesAsync();

            var session = await db.Sessions
                .Include(s => s.Group)
                .FirstOrDefaultAsync(s => s.Id == req.SessionId);

            var student = await db.Students.FindAsync(req.StudentId);

            var response = new PresenceResponse
            {
                Id = presence.Id,
                StudentName = student?.Name ?? "",
                GroupName = session?.Group?.Name ?? "",
                SessionDate = session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                PresenceStatus = presence.Status
            };

            return Results.Created($"/api/presences/{presence.Id}", response);
        }

        private static async Task<IResult> UpdatePresence(ApplicationDbContext db, int id, PresenceRequest req)
        {
            var presence = await db.Presences.FindAsync(id);
            if (presence is null) return Results.NotFound();

            presence.Status = req.Status;
            presence.RecordedAt = DateTime.UtcNow;

            db.Presences.Update(presence);
            await db.SaveChangesAsync();

            var session = await db.Sessions
                .Include(s => s.Group)
                .FirstOrDefaultAsync(s => s.Id == presence.SessionId);

            var student = await db.Students.FindAsync(presence.StudentId);

            var response = new PresenceResponse
            {
                Id = presence.Id,
                StudentName = student?.Name ?? "",
                GroupName = session?.Group?.Name ?? "",
                SessionDate = session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                PresenceStatus = presence.Status
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> DeletePresence(ApplicationDbContext db, int id)
        {
            var presence = await db.Presences.FindAsync(id);
            if (presence is null) return Results.NotFound();

            db.Presences.Remove(presence);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }
    }
}