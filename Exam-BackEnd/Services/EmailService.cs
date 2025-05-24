using System;

namespace ExamFinal.Services;

using MailKit.Net.Smtp;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpAsync(string toEmail, string otp)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["EmailSettings:SenderEmail"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Your OTP Code";
        email.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = $"Your OTP: {otp}" };

        using var smtp = new SmtpClient();
        var portString = _config["EmailSettings:Port"];
        if (string.IsNullOrEmpty(portString))
            throw new InvalidOperationException("SMTP port is not configured.");
        await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], int.Parse(portString), false);
        await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["EmailSettings:SenderEmail"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = body };

        using var smtp = new SmtpClient();
        var portString = _config["EmailSettings:Port"];
        if (string.IsNullOrEmpty(portString))
            throw new InvalidOperationException("SMTP port is not configured.");
        await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"], int.Parse(portString), false);
        await smtp.AuthenticateAsync(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
