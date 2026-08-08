package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.LoginRequest;
import com.timemanager.timemanagementbackend.dto.RegisterRequest;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.model.VerificationToken;
import com.timemanager.timemanagementbackend.repository.UserRepository;
import com.timemanager.timemanagementbackend.repository.VerificationTokenRepository;
import com.timemanager.timemanagementbackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       VerificationTokenRepository verificationTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);

        userRepository.save(user);

        // Verification email එකක් යවනවා (fail වුණත් registration එක fail කරන්නේ නෑ)
        try {
            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = new VerificationToken();
            verificationToken.setToken(token);
            verificationToken.setUser(user);
            verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
            verificationTokenRepository.save(verificationToken);

            emailService.sendVerificationEmail(user.getEmail(), token, frontendUrl);
        } catch (Exception e) {
            System.err.println("Failed to create/send verification token: " + e.getMessage());
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}