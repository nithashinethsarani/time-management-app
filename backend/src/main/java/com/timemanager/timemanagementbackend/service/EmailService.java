package com.timemanager.timemanagementbackend.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    public void sendPasswordResetEmail(String toEmail, String resetToken, String frontendUrl) {
        try {
            Resend resend = new Resend(apiKey);

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;'>"
                    + "<h2 style='color: #4f46e5;'>Reset Your Password</h2>"
                    + "<p>You requested a password reset for your TimeManager account.</p>"
                    + "<p>Click the button below to reset your password. This link expires in 30 minutes.</p>"
                    + "<a href='" + resetLink + "' style='display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;'>Reset Password</a>"
                    + "<p style='color: #666; font-size: 14px;'>If you didn't request this, you can safely ignore this email.</p>"
                    + "</div>";

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("TimeManager <onboarding@resend.dev>")
                    .to(toEmail)
                    .subject("Reset your TimeManager password")
                    .html(htmlContent)
                    .build();

            resend.emails().send(params);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send reset email");
        }
    }

    public void sendVerificationEmail(String toEmail, String verificationToken, String frontendUrl) {
        try {
            Resend resend = new Resend(apiKey);

            String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;'>"
                    + "<h2 style='color: #4f46e5;'>Welcome to TimeManager! 🎉</h2>"
                    + "<p>Thanks for signing up. Please verify your email address to unlock all features.</p>"
                    + "<a href='" + verifyLink + "' style='display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;'>Verify Email</a>"
                    + "<p style='color: #666; font-size: 14px;'>If you didn't create this account, you can safely ignore this email.</p>"
                    + "</div>";

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("TimeManager <onboarding@resend.dev>")
                    .to(toEmail)
                    .subject("Verify your TimeManager email")
                    .html(htmlContent)
                    .build();

            resend.emails().send(params);
        } catch (Exception e) {
            System.err.println("Failed to send verification email (this is OK for local testing): " + e.getMessage());
        }
    }
}