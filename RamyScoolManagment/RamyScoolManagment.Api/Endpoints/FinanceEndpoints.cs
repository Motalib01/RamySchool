    using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class FinanceEndpoints
    {
        public static void MapFinanceEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/finance")
                .WithTags("Finance")  // Changed from WithName to WithTags
                .WithOpenApi();

            group.MapGet("/total", GetTotalRevenue).WithName("GetTotalRevenue");
            group.MapGet("/net", GetNetRevenue).WithName("GetNetRevenue");
            group.MapGet("/teacher/{teacherId}", GetTeacherRevenue).WithName("GetTeacherRevenue");
        }

        private static async Task<IResult> GetTotalRevenue(ApplicationDbContext db)
        {
            var totalRevenue = await db.Sessions
                .Where(s => s.Fee.HasValue)
                .SumAsync(s => s.Fee ?? 0);

            return Results.Ok(new TotalResponse { Total = totalRevenue });
        }

        private static async Task<IResult> GetNetRevenue(ApplicationDbContext db)
        {
            var sessions = await db.Sessions
                .Include(s => s.Group)
                    .ThenInclude(g => g.Teacher)
                .Where(s => s.Fee.HasValue)
                .ToListAsync();

            decimal netRevenue = 0;

            foreach (var session in sessions)
            {
                if (session.Group?.Teacher != null)
                {
                    var teacherPercentage = session.Group.Teacher.Percentage / 100;
                    netRevenue += (session.Fee ?? 0) * (1 - teacherPercentage);
                }
            }

            return Results.Ok(new NetResponse { Net = netRevenue });
        }

        private static async Task<IResult> GetTeacherRevenue(ApplicationDbContext db, int teacherId)
        {
            var teacher = await db.Teachers.FindAsync(teacherId);
            if (teacher is null) return Results.NotFound("Teacher not found.");

            var sessions = await db.Sessions
                .Include(s => s.Group)
                .Where(s => s.CreatedByTeacherId == teacherId && s.Fee.HasValue)
                .ToListAsync();

            decimal revenue = 0;

            foreach (var session in sessions)
            {
                var percentage = teacher.Percentage / 100;
                revenue += (session.Fee ?? 0) * percentage;
            }

            return Results.Ok(new TeacherFinanceResponse
            {
                TeacherId = teacherId,
                Revenue = revenue
            });
        }
    }
}
