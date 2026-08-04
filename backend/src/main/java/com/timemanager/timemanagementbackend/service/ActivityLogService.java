package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.ActivityLogBatchRequest;
import com.timemanager.timemanagementbackend.dto.ActivityLogEntry;
import com.timemanager.timemanagementbackend.model.ActivityLog;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final CurrentUserProvider currentUserProvider;

    public ActivityLogService(ActivityLogRepository activityLogRepository, CurrentUserProvider currentUserProvider) {
        this.activityLogRepository = activityLogRepository;
        this.currentUserProvider = currentUserProvider;
    }

    // Batch එකකින් logs ගොඩක් save කරනවා
    public void saveBatch(ActivityLogBatchRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        for (ActivityLogEntry entry : request.getLogs()) {
            ActivityLog log = new ActivityLog();
            log.setAppName(entry.getAppName());
            log.setStartTime(entry.getStartTime());
            log.setEndTime(entry.getEndTime());
            log.setUser(currentUser);
            activityLogRepository.save(log);
        }
    }

    // Date range එකක් අතරේ logs ගන්නවා
    public List<ActivityLog> getLogsBetween(LocalDateTime start, LocalDateTime end) {
        User currentUser = currentUserProvider.getCurrentUser();
        return activityLogRepository.findByUserAndStartTimeBetween(currentUser, start, end);
    }
}