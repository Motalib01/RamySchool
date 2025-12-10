using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class TeacherEndpoints
    {
        public static void MapTeacherEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/teachers")
                .WithTags("Teachers")
                .WithOpenApi();

            group.MapGet("/", GetAllTeachers).WithName("GetAllTeachers");
            group.MapGet("/{id}", GetTeacherById).WithName("GetTeacherById");
            group.MapPost("/", CreateTeacher).WithName("CreateTeacher");
            group.MapPut("/{id}", UpdateTeacher).WithName("UpdateTeacher");
            group.MapDelete("/{id}", DeleteTeacher).WithName("DeleteTeacher");
        }

        private static async Task<IResult> GetAllTeachers(ApplicationDbContext db)
        {
            var teachers = await db.Teachers
                .Include(t => t.Groups)
                    .ThenInclude(g => g.Enrollments)
                        .ThenInclude(e => e.Student)
                .ToListAsync();

            var response = teachers.Select(t => new TeacherResponse
            {
                Id = t.Id,
                FullName = t.FullName,
                Salary = t.Salary,
                Percentage = t.Percentage,
                Groups = t.Groups.Select(g => new GroupResponse
                {
                    Id = g.Id,
                    Name = g.Name,
                    TeacherId = g.TeacherId,
                    TeacherName = t.FullName,
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
                                TeacherId = t.Id,
                                TeacherName = t.FullName
                            }
                        }
                    }).ToList()
                }).ToList()
            }).ToList();

            return Results.Ok(response);
        }

        private static async Task<IResult> GetTeacherById(ApplicationDbContext db, int id)
        {
            var teacher = await db.Teachers
                .Include(t => t.Groups)
                    .ThenInclude(g => g.Enrollments)
                        .ThenInclude(e => e.Student)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher is null) return Results.NotFound();

            var response = new TeacherResponse
            {
                Id = teacher.Id,
                FullName = teacher.FullName,
                Salary = teacher.Salary,
                Percentage = teacher.Percentage,
                Groups = teacher.Groups.Select(g => new GroupResponse
                {
                    Id = g.Id,
                    Name = g.Name,
                    TeacherId = g.TeacherId,
                    TeacherName = teacher.FullName,
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
                                TeacherId = teacher.Id,
                                TeacherName = teacher.FullName
                            }
                        }
                    }).ToList()
                }).ToList()
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> CreateTeacher(ApplicationDbContext db, TeacherRequest req)
        {
            var teacher = new Teacher
            {
                FullName = req.FullName,
                Salary = req.Salary,
                Percentage = req.Percentage
            };

            db.Teachers.Add(teacher);
            await db.SaveChangesAsync();

            var response = new TeacherResponse
            {
                Id = teacher.Id,
                FullName = teacher.FullName,
                Salary = teacher.Salary,
                Percentage = teacher.Percentage,
                Groups = new List<GroupResponse>()
            };

            return Results.Created($"/api/teachers/{teacher.Id}", response);
        }

        private static async Task<IResult> UpdateTeacher(ApplicationDbContext db, int id, TeacherRequest req)
        {
            var teacher = await db.Teachers.FindAsync(id);
            if (teacher is null) return Results.NotFound();

            teacher.FullName = req.FullName;
            teacher.Salary = req.Salary;
            teacher.Percentage = req.Percentage;

            db.Teachers.Update(teacher);
            await db.SaveChangesAsync();

            var response = new TeacherResponse
            {
                Id = teacher.Id,
                FullName = teacher.FullName,
                Salary = teacher.Salary,
                Percentage = teacher.Percentage,
                Groups = new List<GroupResponse>()
            };

            return Results.Ok(response);
        }

        private static async Task<IResult> DeleteTeacher(ApplicationDbContext db, int id)
        {
            var teacher = await db.Teachers.FindAsync(id);
            if (teacher is null) return Results.NotFound();

            db.Teachers.Remove(teacher);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }
    }
}
