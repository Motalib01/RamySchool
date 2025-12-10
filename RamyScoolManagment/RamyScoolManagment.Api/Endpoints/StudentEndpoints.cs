using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class StudentEndpoints
    {
        public static void MapStudentEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/students")
                .WithTags("Students")
                .WithOpenApi();

            group.MapGet("/", GetAllStudents).WithName("GetAllStudents");
            group.MapGet("/{id}", GetStudentById).WithName("GetStudentById");
            group.MapPost("/", CreateStudent).WithName("CreateStudent");
            group.MapPut("/{id}", UpdateStudent).WithName("UpdateStudent");
            group.MapDelete("/{id}", DeleteStudent).WithName("DeleteStudent");
        }

        private static async Task<IResult> GetAllStudents(ApplicationDbContext db)
        {
            var students = await db.Students
                .Include(s => s.Enrollments)
                    .ThenInclude(e => e.Group)
                        .ThenInclude(g => g.Teacher)
                .Include(s => s.Presences)
                    .ThenInclude(p => p.Session)
                .ToListAsync();

            var response = students.Select(s => new StudentResponse
            {
                Id = s.Id,
                Name = s.Name,
                PhoneNumber = s.PhoneNumber,
                Enrollments = s.Enrollments.Select(e => new GroupEnrollmentInfo
                {
                    GroupId = e.GroupId,
                    GroupName = e.Group?.Name ?? "",
                    TeacherId = e.Group?.TeacherId ?? 0,
                    TeacherName = e.Group?.Teacher?.FullName ?? ""
                }).ToList(),
                Presences = s.Presences.Select(p => new PresenceResponse
                {
                    Id = p.Id,
                    StudentName = s.Name,
                    GroupName = "",
                    SessionDate = p.Session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                    PresenceStatus = p.Status
                }).ToList()
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> GetStudentById(ApplicationDbContext db, int id)
        {
            var student = await db.Students
                .Include(s => s.Enrollments)
                    .ThenInclude(e => e.Group)
                        .ThenInclude(g => g.Teacher)
                .Include(s => s.Presences)
                    .ThenInclude(p => p.Session)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student is null) return Results.NotFound();

            var resp = new StudentResponse
            {
                Id = student.Id,
                Name = student.Name,
                PhoneNumber = student.PhoneNumber,
                Enrollments = student.Enrollments.Select(e => new GroupEnrollmentInfo
                {
                    GroupId = e.GroupId,
                    GroupName = e.Group?.Name ?? "",
                    TeacherId = e.Group?.TeacherId ?? 0,
                    TeacherName = e.Group?.Teacher?.FullName ?? ""
                }).ToList(),
                Presences = student.Presences.Select(p => new PresenceResponse
                {
                    Id = p.Id,
                    StudentName = student.Name,
                    GroupName = "",
                    SessionDate = p.Session?.ScheduledAt.ToString("yyyy-MM-dd") ?? "",
                    PresenceStatus = p.Status
                }).ToList()
            };

            return Results.Ok(resp);
        }

        private static async Task<IResult> CreateStudent(ApplicationDbContext db, StudentRequest req)
        {
            var student = new Student
            {
                Name = req.Name,
                PhoneNumber = req.PhoneNumber
            };

            db.Students.Add(student);
            await db.SaveChangesAsync();

            var resp = new StudentResponse
            {
                Id = student.Id,
                Name = student.Name,
                PhoneNumber = student.PhoneNumber,
                Enrollments = new List<GroupEnrollmentInfo>()
            };

            return Results.Created($"/api/students/{student.Id}", resp);
        }

        private static async Task<IResult> UpdateStudent(ApplicationDbContext db, int id, StudentRequest req)
        {
            var student = await db.Students.FindAsync(id);
            if (student is null) return Results.NotFound();

            student.Name = req.Name;
            student.PhoneNumber = req.PhoneNumber;

            db.Students.Update(student);
            await db.SaveChangesAsync();

            var resp = new StudentResponse
            {
                Id = student.Id,
                Name = student.Name,
                PhoneNumber = student.PhoneNumber,
                Enrollments = new List<GroupEnrollmentInfo>()
            };

            return Results.Ok(resp);
        }

        private static async Task<IResult> DeleteStudent(ApplicationDbContext db, int id)
        {
            var student = await db.Students.FindAsync(id);
            if (student is null) return Results.NotFound();

            db.Students.Remove(student);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }
    }
}
