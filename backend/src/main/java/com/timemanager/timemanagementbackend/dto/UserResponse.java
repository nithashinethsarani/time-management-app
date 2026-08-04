package com.timemanager.timemanagementbackend.dto;

import com.timemanager.timemanagementbackend.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;

    // User entity එකෙන් UserResponse එකක් හදනවා (password එක ඇතුළත් නෑ)
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        return response;
    }
}