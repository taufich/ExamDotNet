using System;

namespace ExamFinal.Models;

public class StudentAnswer
{
    public int Id { get; set; }
    public int StudentExamId { get; set; }
    public StudentExam StudentExam { get; set; } = null!;
    public int QuestionId { get; set; }
    public int SelectedOptionId { get; set; }
}