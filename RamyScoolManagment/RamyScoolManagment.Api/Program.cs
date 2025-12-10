using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Configuration;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Configure SQL Server connection with retry logic
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

builder.Services.AddAuthorization();

// Add Swagger configuration
builder.Services.AddSwaggerConfiguration();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwaggerConfiguration();

app.UseHttpsRedirection();

app.UseAuthorization();

// Map endpoint groups
app.MapStudentEndpoints();
app.MapGroupEndpoints();
app.MapEnrollmentEndpoints();
app.MapAttendanceEndpoints();
app.MapTeacherEndpoints();
app.MapSessionEndpoints();
app.MapPresencesEndpoints();
app.MapAuthEndpoints();
app.MapFinanceEndpoints();

app.Run();
