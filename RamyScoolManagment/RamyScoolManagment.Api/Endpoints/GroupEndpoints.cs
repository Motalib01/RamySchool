using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class GroupEndpoints
    {
        public static void MapGroupEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/groups")
                .WithTags("Groups")
                .WithOpenApi();

            group.MapGet("/", GetAllGroups).WithName("GetAllGroups");
            group.MapGet("/{id}", GetGroupById).WithName("GetGroupById");
            group.MapPost("/", CreateGroup).WithName("CreateGroup");
            group.MapPost("/{groupId}/sessions", AddSessionToGroup).WithName("AddSessionToGroup");
            group.MapPut("/{id}", UpdateGroup).WithName("UpdateGroup");
            group.MapDelete("/{id}", DeleteGroup).WithName("DeleteGroup");
        }

        private static async Task<IResult> GetAllGroups(ApplicationDbContext db)
        {
            var groups = await db.Groups
                .Include(g => g.Teacher)
                .Include(g => g.Enrollments)
                    .ThenInclude(e => e.Student)
                .ToListAsync();

            var response = groups.Select(g => new GroupResponse
            {
                Id = g.Id,
                Name = g.Name,
                TeacherId = g.TeacherId,
                TeacherName = g.Teacher?.FullName ?? "",
                Students = g.Enrollments.Select(e => new StudentResponse
                {
                    Id = e.Student.Id,
                    Name = e.Student.Name,
                    PhoneNumber = e.Student.PhoneNumber,
                    Enrollments = new List<GroupEnrollmentInfo>
                    {
                        new GroupEnrollmentInfo
                        {
                            GroupId = g.Id,
                            GroupName = g.Name,
                            TeacherId = g.TeacherId,
                            TeacherName = g.Teacher?.FullName ?? ""
                        }
                    }
                }).ToList()
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> GetGroupById(ApplicationDbContext db, int id)
        {
            var group = await db.Groups
                .Include(g => g.Teacher)
                .Include(g => g.Enrollments)
                    .ThenInclude(e => e.Student)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (group is null) return Results.NotFound();

            var response = new GroupResponse
            {
                Id = group.Id,
                Name = group.Name,
                TeacherId = group.TeacherId,
                TeacherName = group.Teacher?.FullName ?? "",
                Students = group.Enrollments.Select(e => new StudentResponse
                {
                    Id = e.Student.Id,
                    Name = e.Student.Name,
                    PhoneNumber = e.Student.PhoneNumber,
                    Enrollments = new List<GroupEnrollmentInfo>
                    {
                        new GroupEnrollmentInfo
                        {
                            GroupId = group.Id,
                            GroupName = group.Name,
                            TeacherId = group.TeacherId,
                            TeacherName = group.Teacher?.FullName ?? ""
                        }
                    }
                }).ToList()
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> CreateGroup(ApplicationDbContext db, GroupRequest req)
        {
            var teacher = await db.Teachers.FindAsync(req.TeacherId);
            if (teacher is null) return Results.BadRequest("Teacher not found.");

            var group = new Group
            {
                Name = req.Name,
                TeacherId = req.TeacherId
            };

            db.Groups.Add(group);
            await db.SaveChangesAsync();

            var resp = new GroupResponse
            {
                Id = group.Id,
                Name = group.Name,
                TeacherId = group.TeacherId,
                TeacherName = teacher.FullName,
                Students = new List<StudentResponse>()
            };

            return Results.Created($"/api/groups/{group.Id}", resp);
        }

        private static async Task<IResult> AddSessionToGroup(ApplicationDbContext db, int groupId, SessionRequest req)
        {
            var group = await db.Groups
                .Include(g => g.Enrollments)
                    .ThenInclude(e => e.Student)
                .Include(g => g.Teacher)
                .FirstOrDefaultAsync(g => g.Id == groupId);

            if (group is null) return Results.BadRequest($"Group {groupId} not found.");

            var enrollments = group.Enrollments.ToList();
            if (!enrollments.Any()) return Results.BadRequest("No students enrolled in the group.");

            var createdSessions = new List<Session>();

            foreach (var enrollment in enrollments)
            {
                var session = new Session
                {
                    EnrollmentId = enrollment.Id,
                    ScheduledAt = req.ScheduledAt,
                    Type = (SessionType)req.Type,
                    Fee = req.Price,
                    IsAdditional = true,
                    CreatedByTeacherId = group.TeacherId
                };

                db.Sessions.Add(session);
                await db.SaveChangesAsync();

                var presence = new Presence
                {
                    SessionId = session.Id,
                    StudentId = enrollment.StudentId,
                    Status = PresenceStatus.Pending,
                    RecordedAt = DateTime.UtcNow
                };
                db.Presences.Add(presence);

                createdSessions.Add(session);
            }

            await db.SaveChangesAsync();

            var resp = createdSessions.Select(s => new SessionResponse
            {
                Id = s.Id,
                Type = s.Type,
                ScheduledAt = s.ScheduledAt,
                Price = s.Fee,
                GroupName = group.Name,
                TeacherName = group.Teacher?.FullName,
                IsAdditional = s.IsAdditional
            });

            return Results.Created($"/api/groups/{groupId}/sessions", resp);
        }

        private static async Task<IResult> UpdateGroup(ApplicationDbContext db, int id, GroupRequest req)
        {
            var group = await db.Groups
                .Include(g => g.Teacher)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (group is null) return Results.NotFound();

            group.Name = req.Name;
            group.TeacherId = req.TeacherId;

            var teacher = await db.Teachers.FindAsync(req.TeacherId);
            if (teacher is null) return Results.BadRequest("Teacher not found.");

            db.Groups.Update(group);
            await db.SaveChangesAsync();

            var resp = new GroupResponse
            {
                Id = group.Id,
                Name = group.Name,
                TeacherId = group.TeacherId,
                TeacherName = teacher.FullName,
                Students = new List<StudentResponse>()
            };

            return Results.Ok(resp);
        }

        private static async Task<IResult> DeleteGroup(ApplicationDbContext db, int id)
        {
            var group = await db.Groups.FindAsync(id);
            if (group is null) return Results.NotFound();

            db.Groups.Remove(group);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }
    }
}
