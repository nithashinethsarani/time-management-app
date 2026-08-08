package com.timemanager.timemanagementbackend.repository;

import com.timemanager.timemanagementbackend.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);
}