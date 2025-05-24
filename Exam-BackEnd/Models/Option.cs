using System;

namespace ExamFinal.Models;

public class Option
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}

