using System;

namespace ExamFinal.Models.DTOs;

public class ExamCreateDto
{
    public string Title { get; set; } = null!;
    public List<QuestionCreateDto> Questions { get; set; } = new();
}

public class QuestionCreateDto
{
    public string Text { get; set; } = null!;
    public List<string> Options { get; set; } = new();
    public int CorrectIndex { get; set; }
    public int Marks { get; set; }
}

