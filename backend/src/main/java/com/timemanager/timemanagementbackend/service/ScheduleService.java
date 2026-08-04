package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.ScheduleRequest;
import com.timemanager.timemanagementbackend.model.Schedule;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CurrentUserProvider currentUserProvider;

    public ScheduleService(ScheduleRepository scheduleRepository, CurrentUserProvider currentUserProvider) {
        this.scheduleRepository = scheduleRepository;
        this.currentUserProvider = currentUserProvider;
    }

    // අලුත් schedule එකක් හදනවා
    public Schedule createSchedule(ScheduleRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        Schedule schedule = new Schedule();
        schedule.setTitle(request.getTitle());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDaysOfWeek(request.getDaysOfWeek());
        schedule.setReminderMinutesBefore(request.getReminderMinutesBefore());
        schedule.setUser(currentUser);

        return scheduleRepository.save(schedule);
    }

    // login වෙච්ච user ගේ schedules ඔක්කොම ගන්නවා
    public List<Schedule> getMySchedules() {
        User currentUser = currentUserProvider.getCurrentUser();
        return scheduleRepository.findByUser(currentUser);
    }

    // schedule එකක් update කරනවා
    public Schedule updateSchedule(Long id, ScheduleRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        List<Schedule> found = scheduleRepository.findByUserAndId(currentUser, id);
        if (found.isEmpty()) {
            throw new RuntimeException("Schedule not found or doesn't belong to you");
        }

        Schedule schedule = found.get(0);
        schedule.setTitle(request.getTitle());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDaysOfWeek(request.getDaysOfWeek());
        schedule.setReminderMinutesBefore(request.getReminderMinutesBefore());

        return scheduleRepository.save(schedule);
    }

    // schedule එකක් delete කරනවා
    public void deleteSchedule(Long id) {
        User currentUser = currentUserProvider.getCurrentUser();

        List<Schedule> found = scheduleRepository.findByUserAndId(currentUser, id);
        if (found.isEmpty()) {
            throw new RuntimeException("Schedule not found or doesn't belong to you");
        }

        scheduleRepository.delete(found.get(0));
    }
}