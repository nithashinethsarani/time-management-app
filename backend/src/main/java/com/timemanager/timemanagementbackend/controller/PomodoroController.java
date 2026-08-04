package com.timemanager.timemanagementbackend.controller;

import com.timemanager.timemanagementbackend.dto.PomodoroRequest;
import com.timemanager.timemanagementbackend.model.PomodoroSession;
import com.timemanager.timemanagementbackend.service.PomodoroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {

    private final PomodoroService pomodoroService;

    public PomodoroController(PomodoroService pomodoroService) {
        this.pomodoroService = pomodoroService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startSession(@RequestBody PomodoroRequest request) {
        try {
            PomodoroSession session = pomodoroService.startSession(request);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<?> endSession(@PathVariable Long id) {
        try {
            PomodoroSession session = pomodoroService.endSession(id);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<PomodoroSession>> getMySessions() {
        return ResponseEntity.ok(pomodoroService.getMySessions());
    }
}