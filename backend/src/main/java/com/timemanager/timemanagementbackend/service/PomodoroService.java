package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.PomodoroRequest;
import com.timemanager.timemanagementbackend.model.PomodoroSession;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.PomodoroSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PomodoroService {

    private final PomodoroSessionRepository pomodoroSessionRepository;
    private final CurrentUserProvider currentUserProvider;

    public PomodoroService(PomodoroSessionRepository pomodoroSessionRepository, CurrentUserProvider currentUserProvider) {
        this.pomodoroSessionRepository = pomodoroSessionRepository;
        this.currentUserProvider = currentUserProvider;
    }

    // Session එකක් start කරනවා
    public PomodoroSession startSession(PomodoroRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        PomodoroSession session = new PomodoroSession();
        session.setType(request.getType());
        session.setPlannedDurationMinutes(request.getPlannedDurationMinutes());
        session.setStartTime(LocalDateTime.now());
        session.setCompleted(false);
        session.setUser(currentUser);

        return pomodoroSessionRepository.save(session);
    }

    // Session එකක් end කරනවා
    public PomodoroSession endSession(Long id) {
        User currentUser = currentUserProvider.getCurrentUser();

        List<PomodoroSession> found = pomodoroSessionRepository.findByUserAndId(currentUser, id);
        if (found.isEmpty()) {
            throw new RuntimeException("Session not found or doesn't belong to you");
        }

        PomodoroSession session = found.get(0);
        session.setEndTime(LocalDateTime.now());
        session.setCompleted(true);

        return pomodoroSessionRepository.save(session);
    }

    // login වෙච්ච user ගේ sessions ඔක්කොම ගන්නවා (history)
    public List<PomodoroSession> getMySessions() {
        User currentUser = currentUserProvider.getCurrentUser();
        return pomodoroSessionRepository.findByUser(currentUser);
    }
}