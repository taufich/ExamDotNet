using System;

namespace ExamFinal.Models;

public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public required string CreatedById { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Question> Questions { get; set; } = new();
}
