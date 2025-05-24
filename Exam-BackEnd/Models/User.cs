using System;

namespace ExamFinal.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = "Student"; // or "Teacher"
    public string? OTP { get; set; }
    public DateTime? OTPExpiry { get; set; }
}
