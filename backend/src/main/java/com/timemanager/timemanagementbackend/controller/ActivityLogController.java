package com.timemanager.timemanagementbackend.controller;

import com.timemanager.timemanagementbackend.dto.ActivityLogBatchRequest;
import com.timemanager.timemanagementbackend.model.ActivityLog;
import com.timemanager.timemanagementbackend.service.ActivityLogService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @PostMapping("/batch")
    public ResponseEntity<?> saveBatch(@RequestBody ActivityLogBatchRequest request) {
        try {
            activityLogService.saveBatch(request);
            return ResponseEntity.ok(Map.of("message", "Logs saved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(activityLogService.getLogsBetween(start, end));
    }
}