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

        // Teacher -> Group (1..*)
        modelBuilder.Entity<Teacher>()
            .HasMany(t => t.Groups)
            .WithOne(g => g.Teacher)
            .HasForeignKey(g => g.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Enrollment: unique Student + Group
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.StudentId, e.GroupId })
            .IsUnique();

        // Student -> Enrollment (1..*)
        modelBuilder.Entity<Student>()
            .HasMany(s => s.Enrollments)
            .WithOne(e => e.Student)
            .HasForeignKey(e => e.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Group -> Enrollment (1..*)
        modelBuilder.Entity<Group>()
            .HasMany(g => g.Enrollments)
            .WithOne(e => e.Group)
            .HasForeignKey(e => e.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        // Group -> Session (1..*)
        modelBuilder.Entity<Group>()
            .HasMany(g => g.Sessions)
            .WithOne(s => s.Group)
            .HasForeignKey(s => s.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        // Student -> Presence (1..*)
        // CHANGED TO NoAction to avoid multiple cascade paths
        modelBuilder.Entity<Student>()
            .HasMany(s => s.Presences)
            .WithOne(p => p.Student)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.NoAction);

        // Session -> Presence (1..*)
        modelBuilder.Entity<Session>()
            .HasMany(s => s.Presences)
            .WithOne(p => p.Session)
            .HasForeignKey(p => p.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Presence: unique index for session+student (one presence per student per session)
        modelBuilder.Entity<Presence>()
            .HasIndex(p => new { p.SessionId, p.StudentId })
            .IsUnique();
    }
}