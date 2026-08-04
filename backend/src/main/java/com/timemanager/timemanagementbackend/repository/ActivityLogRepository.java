package com.timemanager.timemanagementbackend.repository;

import com.timemanager.timemanagementbackend.model.ActivityLog;
import com.timemanager.timemanagementbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // Reports සඳහා - date range එකක් අතරේ තියෙන logs ගන්නවා
    List<ActivityLog> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}