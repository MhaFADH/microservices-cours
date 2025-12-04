package com.example.identity.service;

import com.example.identity.dto.LoginDTO;
import com.example.identity.dto.RegisterDTO;
import com.example.identity.entity.User;
import com.example.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LogService logService;

    public String register(RegisterDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            logService.log("ERROR", "Registration failed: username already exists - " + dto.getUsername());
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setDisplayName(dto.getDisplayName());
        userRepository.save(user);

        logService.log("INFO", "User registered: " + user.getUsername());
        return jwtService.generate(user.getId());
    }

    public String login(LoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> {
                    logService.log("ERROR", "Login failed: user not found - " + dto.getUsername());
                    return new RuntimeException("Invalid credentials");
                });

        if (!user.getPassword().equals(dto.getPassword())) {
            logService.log("ERROR", "Login failed: invalid password - " + dto.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        logService.log("INFO", "User logged in: " + user.getUsername());
        return jwtService.generate(user.getId());
    }
}
