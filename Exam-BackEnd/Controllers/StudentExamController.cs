using ExamFinal.Data;
using ExamFinal.Models;
using ExamFinal.Models.DTOs;
using ExamFinal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExamFinal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentExamController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public StudentExamController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [Authorize]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit(ExamSubmitDto dto, [FromQuery] int studentId)
        {
            // Get user ID from token
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
                return BadRequest("Invalid user ID in token.");

            // Optional security check
            if (userId != studentId)
                return Forbid("You are not authorized to submit this exam for another student.");

            // Load exam and questions
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == dto.ExamId);

            if (exam == null) return NotFound("Exam not found.");

            var studentExam = new StudentExam { ExamId = dto.ExamId, UserId = studentId };
            int score = 0;

            foreach (var ans in dto.Answers)
            {
                var q = exam.Questions.FirstOrDefault(x => x.Id == ans.QuestionId);
                if (q == null) continue;

                studentExam.StudentAnswers ??= new List<StudentAnswer>();
                studentExam.StudentAnswers.Add(new StudentAnswer
                {
                    QuestionId = ans.QuestionId,
                    SelectedOptionId = ans.SelectedOptionId
                });

                if (ans.SelectedOptionId == q.CorrectOptionId)
                    score += q.Marks;
            }

            studentExam.Score = score;
            _context.StudentExams.Add(studentExam);
            await _context.SaveChangesAsync();

            int totalMarks = exam.Questions.Sum(q => q.Marks);

            // Fetch student and teacher info
            var student = await _context.Users.FindAsync(userId);
            var teacher = await _context.Users.FindAsync(int.Parse(exam.CreatedById));

            // Prepare email content
            string subject = $"Exam Results: {exam.Title}";
            string studentBody = $"Dear {student?.Username},\n\nYou scored {score} out of {totalMarks} in the exam \"{exam.Title}\".\n\nBest regards,\nExam System";
            string teacherBody = $"Dear {teacher?.Username},\n\nStudent {student?.Username} scored {score} out of {totalMarks} in your exam \"{exam.Title}\".\n\nBest regards,\nExam System";

            // Send emails (async)
            if (student != null)
                _ = _emailService.SendEmailAsync(student.Email, subject, studentBody);
            if (teacher != null)
                _ = _emailService.SendEmailAsync(teacher.Email, subject, teacherBody);

            return Ok(new { studentExam.Id, studentExam.Score, Total = totalMarks });
        }

        [Authorize]
        [HttpGet("results/{studentId}")]
        public async Task<IActionResult> GetResults(int studentId)
        {
            var results = await _context.StudentExams
                .Where(se => se.UserId == studentId)
                .Include(se => se.Exam)
                .ThenInclude(e => e.Questions)
                .ToListAsync();

            return Ok(results.Select(r =>
            {
                int total = r.Exam.Questions.Sum(q => q.Marks);
                double percentage = total > 0 ? Math.Round((r.Score * 100.0) / total) : 0;
                return new
                {
                    r.Exam.Title,
                    Score = r.Score,
                    Total = total,
                    Percentage = percentage,
                    r.SubmittedAt
                };
            }));
        }
    }
}
