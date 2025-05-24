using System;

namespace ExamFinal.Models.DTOs;

public class ExamSubmitDto
{
    public int ExamId { get; set; }
    public List<AnswerDto> Answers { get; set; } = new();
}

public class AnswerDto
{
    public int QuestionId { get; set; }
    public int SelectedOptionId { get; set; }
}

