package com.timemanager.timemanagementbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityLogEntry {
    private String appName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}