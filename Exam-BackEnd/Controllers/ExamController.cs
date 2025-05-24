using ExamFinal.Data;
using ExamFinal.Models;
using ExamFinal.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExamFinal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateExam(ExamCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User authentication failed. Empty user ID.");

            var exam = new Exam { Title = dto.Title, CreatedById = userId };
            foreach (var q in dto.Questions)
            {
                var question = new Question { Text = q.Text, Marks = q.Marks };
                for (int i = 0; i < q.Options.Count; i++)
                {
                    var opt = new Option { Text = q.Options[i] };
                    question.Options.Add(opt);
                }
                question.CorrectOptionId = question.Options[q.CorrectIndex].Id;
                exam.Questions.Add(question);
            }

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            foreach (var question in exam.Questions)
            {
                var dtoQuestion = dto.Questions.FirstOrDefault(q => q.Text == question.Text);
                if (dtoQuestion != null && question.Options.Count > dtoQuestion.CorrectIndex && dtoQuestion.CorrectIndex >= 0)
                {
                    question.CorrectOptionId = question.Options.ElementAt(dtoQuestion.CorrectIndex).Id;
                }
            }
            await _context.SaveChangesAsync();

            // Return a DTO to avoid circular reference
            var response = new
            {
                exam.Id,
                exam.Title,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Text,
                    Options = q.Options.Select(o => new { o.Id, o.Text }),
                    q.CorrectOptionId,
                    q.Marks,
                })
            };

            return Ok(response);
        }
        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            var exams = await _context.Exams
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .ToListAsync();

            var response = exams.Select(exam => new
            {
                exam.Id,
                exam.Title,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Text,
                    Options = q.Options.Select(o => new { o.Id, o.Text }),
                    q.CorrectOptionId,
                    q.Marks
                })
            });

            return Ok(response);
        }
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound("Exam not found.");

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
            return Ok("Exam deleted.");
        }
        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateExam(int id, ExamUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                return NotFound("Exam not found.");

            // Only allow the creator to update
            if (exam.CreatedById != userId)
                return Forbid("You are not allowed to update this exam.");

            exam.Title = dto.Title;

            // Remove questions not in DTO
            exam.Questions.RemoveAll(q => !dto.Questions.Any(dq => dq.Id == q.Id));

            foreach (var qDto in dto.Questions)
            {
                Question? question;
                if (qDto.Id.HasValue)
                {
                    // Update existing question
                    question = exam.Questions.FirstOrDefault(q => q.Id == qDto.Id.Value);
                    if (question == null) continue;
                    question.Text = qDto.Text;

                    // Remove options not in DTO
                    question.Options.RemoveAll(o => !qDto.Options.Any(doq => doq.Id == o.Id));
                }
                else
                {
                    // Add new question
                    question = new Question { Text = qDto.Text, Marks = qDto.Marks, Options = new List<Option>() };
                    exam.Questions.Add(question);
                }

                // Update/Add options
                for (int i = 0; i < qDto.Options.Count; i++)
                {
                    var oDto = qDto.Options[i];
                    Option? option;
                    if (oDto.Id.HasValue && question.Options.Any(o => o.Id == oDto.Id.Value))
                    {
                        option = question.Options.First(o => o.Id == oDto.Id.Value);
                        option.Text = oDto.Text;
                    }
                    else
                    {
                        option = new Option { Text = oDto.Text };
                        question.Options.Add(option);
                    }
                }

                // Set correct option
                if (qDto.CorrectIndex >= 0 && qDto.CorrectIndex < question.Options.Count)
                    question.CorrectOptionId = question.Options[qDto.CorrectIndex].Id;
                // Update marks if needed
                question.Marks = qDto.Marks;
            }

            await _context.SaveChangesAsync();

            // Return a DTO to avoid circular reference
            var response = new
            {
                exam.Id,
                exam.Title,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Text,
                    q.Marks,
                    Options = q.Options.Select(o => new { o.Id, o.Text }),
                    q.CorrectOptionId
                })
            };

            return Ok(response);
        }

        [Authorize]
        [HttpGet("results/{examId}")]
        public async Task<IActionResult> GetExamResults(int examId)
        {
            // Get the exam to ensure it exists
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == examId);

            if (exam == null)
                return NotFound("Exam not found.");

            // Query StudentExams for this exam
            var studentExams = await _context.StudentExams
                .Where(se => se.ExamId == examId)
                .Include(se => se.User)
                .Include(se => se.StudentAnswers)
                .ToListAsync();

            // Calculate score for each student
            var results = studentExams.Select(se =>
            {
                var score = se.StudentAnswers.Sum(ans =>
                {
                    var question = exam.Questions.FirstOrDefault(q => q.Id == ans.QuestionId);
                    return (question != null && ans.SelectedOptionId == question.CorrectOptionId) ? question.Marks : 0;
                });

                return new
                {
                    StudentId = se.User.Id,
                    StudentName = se.User.Username,
                    Score = score,

                };
            });

            return Ok(results);
        }
    }
}
