using System;
using ExamFinal.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamFinal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Option> Options => Set<Option>();
    public DbSet<StudentExam> StudentExams => Set<StudentExam>();
    public DbSet<StudentAnswer> StudentAnswers => Set<StudentAnswer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Question>()
            .HasOne(q => q.Exam)
            .WithMany(e => e.Questions)
            .HasForeignKey(q => q.ExamId);

        modelBuilder.Entity<Option>()
            .HasOne(o => o.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(o => o.QuestionId);

        modelBuilder.Entity<StudentExam>()
            .HasOne(se => se.User)
            .WithMany()
            .HasForeignKey(se => se.UserId);

        modelBuilder.Entity<StudentExam>()
            .HasOne(se => se.Exam)
            .WithMany()
            .HasForeignKey(se => se.ExamId);

        modelBuilder.Entity<StudentAnswer>()
            .HasOne(sa => sa.StudentExam)
            .WithMany(se => se.StudentAnswers)
            .HasForeignKey(sa => sa.StudentExamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

