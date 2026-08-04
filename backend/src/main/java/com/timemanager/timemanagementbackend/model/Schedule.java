package com.timemanager.timemanagementbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String daysOfWeek; // "MON,WED,FRI" විදිහට comma-separated string එකක් විදිහට save කරනවා

    private Integer reminderMinutesBefore;

    // මේ schedule එක කාගේද කියලා දැනගන්න, User table එකට link කරනවා
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}