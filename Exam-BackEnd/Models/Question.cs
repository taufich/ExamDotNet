using System;

namespace ExamFinal.Models;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public int ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    public List<Option> Options { get; set; } = new();
    public int CorrectOptionId { get; set; }
    public int Marks { get; set; }
}
