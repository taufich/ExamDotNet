using System;

namespace ExamFinal.Models.DTOs;

public class ExamUpdateDto
{
    public string Title { get; set; } = null!;
    public List<QuestionUpdateDto> Questions { get; set; } = new();
}

public class QuestionUpdateDto
{
    public int? Id { get; set; } // null for new questions
    public string Text { get; set; } = null!;
    public List<OptionUpdateDto> Options { get; set; } = new();
    public int CorrectIndex { get; set; }
    public int Marks { get; set; }
}

public class OptionUpdateDto
{
    public int? Id { get; set; } // null for new options
    public string Text { get; set; } = null!;
}