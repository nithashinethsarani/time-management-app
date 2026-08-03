package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.model.ActivityLog;
import com.timemanager.timemanagementbackend.model.PomodoroSession;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.ActivityLogRepository;
import com.timemanager.timemanagementbackend.repository.PomodoroSessionRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final ActivityLogRepository activityLogRepository;
    private final PomodoroSessionRepository pomodoroSessionRepository;
    private final CurrentUserProvider currentUserProvider;

    public ReportService(ActivityLogRepository activityLogRepository,
                         PomodoroSessionRepository pomodoroSessionRepository,
                         CurrentUserProvider currentUserProvider) {
        this.activityLogRepository = activityLogRepository;
        this.pomodoroSessionRepository = pomodoroSessionRepository;
        this.currentUserProvider = currentUserProvider;
    }

    public Map<String, Object> generateReport(LocalDateTime start, LocalDateTime end) {
        User currentUser = currentUserProvider.getCurrentUser();

        // 1. Activity logs ගන්නවා
        List<ActivityLog> logs = activityLogRepository.findByUserAndStartTimeBetween(currentUser, start, end);

        // 2. App එකක් අනුව time breakdown හදනවා (VS Code: 45 min, Chrome: 15 min...)
        Map<String, Long> appBreakdown = new HashMap<>();
        long totalActivityMinutes = 0;

        for (ActivityLog log : logs) {
            long minutes = Duration.between(log.getStartTime(), log.getEndTime()).toMinutes();
            appBreakdown.merge(log.getAppName(), minutes, Long::sum);
            totalActivityMinutes += minutes;
        }

        // 3. Pomodoro sessions ගන්නවා
        List<PomodoroSession> sessions = pomodoroSessionRepository.findByUserAndStartTimeBetween(currentUser, start, end);

        long totalWorkMinutes = 0;
        long totalBreakMinutes = 0;
        int completedPomodoros = 0;

        for (PomodoroSession session : sessions) {
            if (session.getCompleted() && session.getEndTime() != null) {
                long minutes = Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();

                if (session.getType() == PomodoroSession.SessionType.WORK) {
                    totalWorkMinutes += minutes;
                    completedPomodoros++;
                } else {
                    totalBreakMinutes += minutes;
                }
            }
        }

        // 4. ඔක්කොම එකට report object එකක් හදනවා
        Map<String, Object> report = new HashMap<>();
        report.put("totalActivityMinutes", totalActivityMinutes);
        report.put("appBreakdown", appBreakdown);
        report.put("totalWorkMinutes", totalWorkMinutes);
        report.put("totalBreakMinutes", totalBreakMinutes);
        report.put("completedPomodoros", completedPomodoros);

        return report;
    }
}