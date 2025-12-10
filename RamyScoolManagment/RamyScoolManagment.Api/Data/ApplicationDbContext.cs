using Microsoft.EntityFrameworkCore;
using RamyScoolManagment.Api.Models;

namespace RamyScoolManagment.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Presence> Presences => Set<Presence>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User: unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Configure decimal properties with precision and scale
        modelBuilder.Entity<Session>()
            .Property(s => s.Fee)
            .HasPrecision(18, 2); // precision: 18, scale: 2

        modelBuilder.Entity<Teacher>()
            .Property(t => t.Salary)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Teacher>()
            .Property(t => t.Percentage)
            .HasPrecision(5, 2); // allows percentages like 99.99

        // Enrollment: unique Student + Group
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.StudentId, e.GroupId })
            .IsUnique();

        // Student -> Enrollment (1..* )
        modelBuilder.Entity<Student>()
            .HasMany(s => s.Enrollments)
            .WithOne(e => e.Student)
            .HasForeignKey(e => e.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Group -> Enrollment
        modelBuilder.Entity<Group>()
            .HasMany(g => g.Enrollments)
            .WithOne(e => e.Group)
            .HasForeignKey(e => e.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        // Enrollment -> Session
        modelBuilder.Entity<Enrollment>()
            .HasMany(e => e.Sessions)
            .WithOne(s => s.Enrollment)
            .HasForeignKey(s => s.EnrollmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Session -> Presence
        modelBuilder.Entity<Session>()
            .HasMany(s => s.Presences)
            .WithOne(p => p.Session)
            .HasForeignKey(p => p.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Presence: optional index for fast lookup by session+student
        modelBuilder.Entity<Presence>()
            .HasIndex(p => new { p.SessionId, p.StudentId })
            .IsUnique(false);
    }
}