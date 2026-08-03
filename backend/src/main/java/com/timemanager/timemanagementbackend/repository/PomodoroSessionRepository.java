package com.timemanager.timemanagementbackend.repository;

import com.timemanager.timemanagementbackend.model.PomodoroSession;
import com.timemanager.timemanagementbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {

    // මේ user ගේ sessions ඔක්කොම ගන්නවා
    List<PomodoroSession> findByUser(User user);

    // මේ user ගේ, id එකෙන් session එකක් ගන්නවා (ownership check සඳහා)
    List<PomodoroSession> findByUserAndId(User user, Long id);

    // Report සඳහා - date range එකක් අතරේ තියෙන sessions ගන්නවා
    List<PomodoroSession> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}