package com.timemanager.timemanagementbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pomodoro_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PomodoroSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionType type; // WORK, SHORT_BREAK, LONG_BREAK

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime; // session එක end වුණාම update කරනවා

    @Column(nullable = false)
    private Integer plannedDurationMinutes;

    @Column(nullable = false)
    private Boolean completed = false; // user එක අතරමැදදී cancel කළාද, ඉවර කළාද

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum SessionType {
        WORK, SHORT_BREAK, LONG_BREAK
    }
}