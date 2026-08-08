package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.model.VerificationToken;
import com.timemanager.timemanagementbackend.repository.UserRepository;
import com.timemanager.timemanagementbackend.repository.VerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailVerificationService {

    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;

    public EmailVerificationService(VerificationTokenRepository verificationTokenRepository,
                                    UserRepository userRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
        this.userRepository = userRepository;
    }

    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification link"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This verification link has expired");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
    }
}