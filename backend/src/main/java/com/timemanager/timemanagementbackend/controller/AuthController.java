package com.timemanager.timemanagementbackend.controller;

import com.timemanager.timemanagementbackend.dto.LoginRequest;
import com.timemanager.timemanagementbackend.dto.RegisterRequest;
import com.timemanager.timemanagementbackend.dto.ForgotPasswordRequest;
import com.timemanager.timemanagementbackend.dto.ResetPasswordRequest;
import com.timemanager.timemanagementbackend.service.AuthService;
import com.timemanager.timemanagementbackend.service.PasswordResetService;
import com.timemanager.timemanagementbackend.service.EmailVerificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService,
                          EmailVerificationService emailVerificationService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);
            return ResponseEntity.ok(Map.of("token", token, "message", "Registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            emailVerificationService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}