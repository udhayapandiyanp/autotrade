package com.usedvehicle.service;

import com.usedvehicle.dto.AuthResponse;
import com.usedvehicle.dto.LoginRequest;
import com.usedvehicle.dto.RegisterRequest;
import com.usedvehicle.dto.UserResponse;
import com.usedvehicle.entity.Role;
import com.usedvehicle.entity.User;
import com.usedvehicle.repository.RoleRepository;
import com.usedvehicle.repository.UserRepository;
import com.usedvehicle.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        // Enforce role security: ADMIN registration is blocked from the public endpoint
        String requestedRole = request.getRole().toUpperCase();
        if ("ADMIN".equals(requestedRole)) {
            throw new IllegalArgumentException("Registration as ADMIN is not permitted.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        Role role = roleRepository.findByName(requestedRole)
                .orElseThrow(() -> new IllegalArgumentException("Invalid role selected."));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getPhone(),
                savedUser.getRole().getName()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().getName());

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getRole().getName()
        );

        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getRole().getName()
        );
    }
}
