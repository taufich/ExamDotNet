using System;

namespace ExamFinal.Services;

public interface IEmailService
{
    Task SendOtpAsync(string toEmail, string otp);
    Task SendEmailAsync(string toEmail, string subject, string body);
}
