package com.timemanager.timemanagementbackend.repository;

import com.timemanager.timemanagementbackend.model.Schedule;
import com.timemanager.timemanagementbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // මේ user ගේ schedules ඔක්කොම ගන්නවා
    List<Schedule> findByUser(User user);

    // මේ user ගේ, id එකෙන් schedule එකක් ගන්නවා (delete/update කරන්න කලින් ownership check කරන්න)
    List<Schedule> findByUserAndId(User user, Long id);
}