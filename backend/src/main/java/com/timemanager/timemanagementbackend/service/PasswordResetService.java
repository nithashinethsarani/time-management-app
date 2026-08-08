package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.ForgotPasswordRequest;
import com.timemanager.timemanagementbackend.dto.ResetPasswordRequest;
import com.timemanager.timemanagementbackend.model.PasswordResetToken;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.PasswordResetTokenRepository;
import com.timemanager.timemanagementbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return;
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        // Email sending fail වුණත්, token එක save වෙලා තියෙනවා - request එක fail කරන්නේ නෑ
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token, frontendUrl);
        } catch (Exception e) {
            System.err.println("Email sending failed (this is OK for local testing): " + e.getMessage());
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        if (resetToken.getUsed()) {
            throw new RuntimeException("This reset link has already been used");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This reset link has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}