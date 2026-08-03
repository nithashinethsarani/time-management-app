package com.timemanager.timemanagementbackend.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ScheduleRequest {
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private String daysOfWeek; // "MON,WED,FRI"
    private Integer reminderMinutesBefore;
}