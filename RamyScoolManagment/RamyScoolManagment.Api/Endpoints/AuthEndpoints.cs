using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Data;
using RamyScoolManagment.Api.Models;
using RamyScoolManagment.Api.Requests;
using RamyScoolManagment.Api.Responses;

namespace RamyScoolManagment.Api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/auth")
                .WithTags("Authentication")
                .WithOpenApi();

            group.MapPost("/register", Register).WithName("Register");
            group.MapPost("/login", Login).WithName("Login");
        }

        private static async Task<IResult> Register(ApplicationDbContext db, RegisterRequest req)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return Results.BadRequest("Email and password are required.");

            if (string.IsNullOrWhiteSpace(req.FullName))
                return Results.BadRequest("Full name is required.");

            if (req.Password.Length < 6)
                return Results.BadRequest("Password must be at least 6 characters long.");

            // Check if user already exists
            var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (existingUser is not null)
                return Results.Conflict("User with this email already exists.");

            // Hash password
            var passwordHash = HashPassword(req.Password);

            // Create user
            var user = new User
            {
                Email = req.Email,
                PasswordHash = passwordHash,
                FullName = req.FullName,
                Role = req.Role ?? "User",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            // Generate token
            var token = GenerateToken(user);

            var response = new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role
            };

            return Results.Created($"/api/auth/users/{user.Id}", response);
        }

        private static async Task<IResult> Login(ApplicationDbContext db, LoginRequest req)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return Results.BadRequest("Email and password are required.");

            // Find user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user is null)
                return Results.Unauthorized();

            // Check if user is active
            if (!user.IsActive)
                return Results.BadRequest("User account is inactive.");

            // Verify password
            if (!VerifyPassword(req.Password, user.PasswordHash))
                return Results.Unauthorized();

            // Generate token
            var token = GenerateToken(user);

            var response = new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role
            };

            return Results.Ok(response);
        }

        private static string HashPassword(string password)
        {
            // Use SHA256 for simplicity (for production, use BCrypt or ASP.NET Core Identity)
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }

        private static string GenerateToken(User user)
        {
            // This is a simple token. For production, use JWT with proper signing
            var tokenData = $"{user.Id}:{user.Email}:{user.Role}:{DateTime.UtcNow.Ticks}";
            var tokenBytes = Encoding.UTF8.GetBytes(tokenData);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}