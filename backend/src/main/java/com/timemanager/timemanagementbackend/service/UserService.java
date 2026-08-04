package com.timemanager.timemanagementbackend.service;

import com.timemanager.timemanagementbackend.dto.ChangePasswordRequest;
import com.timemanager.timemanagementbackend.dto.UpdateProfileRequest;
import com.timemanager.timemanagementbackend.model.User;
import com.timemanager.timemanagementbackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CurrentUserProvider currentUserProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.currentUserProvider = currentUserProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public User updateProfile(UpdateProfileRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        // Email එක වෙනස් කරනවා නම්, ඒක already පාවිච්චි කරලා නැද්ද කියලා check කරනවා
        if (!currentUser.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        currentUser.setName(request.getName());
        currentUser.setEmail(request.getEmail());

        return userRepository.save(currentUser);
    }

    public void changePassword(ChangePasswordRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }
}