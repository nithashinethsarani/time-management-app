package com.timemanager.timemanagementbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ActivityLogBatchRequest {
    private List<ActivityLogEntry> logs;
}