package com.timemanager.timemanagementbackend.dto;

import com.timemanager.timemanagementbackend.model.PomodoroSession;
import lombok.Data;

@Data
public class PomodoroRequest {
    private PomodoroSession.SessionType type; // WORK, SHORT_BREAK, LONG_BREAK
    private Integer plannedDurationMinutes;
}