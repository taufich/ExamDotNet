using System;
using System.Collections.Generic;

namespace ExamFinal.Models;

public class StudentExam
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    public int Score { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}