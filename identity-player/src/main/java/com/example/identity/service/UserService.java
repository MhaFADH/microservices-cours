package com.example.identity.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.identity.dto.UserDTO;
import com.example.identity.entity.User;
import com.example.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LogService logService;

    @Cacheable(value = "allUsers")
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "users", key = "#id")
    public UserDTO getUserById(String id) {
        System.out.println("=== UserService.getUserById ===");
        System.out.println("Looking for user with ID: '" + id + "'");
        System.out.println("ID length: " + id.length());

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("User not found in database!");
                    System.out.println("Total users in DB: " + userRepository.count());
                    return new RuntimeException("User not found");
                });

        System.out.println("User found: " + user.getUsername());
        return toDTO(user);
    }

    @CachePut(value = "users", key = "#id")
    @CacheEvict(value = "allUsers", allEntries = true)
    public UserDTO updateMmr(String id, Integer mmr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setMmr(mmr);
        userRepository.save(user);
        logService.log("INFO", "MMR updated for user: " + user.getUsername() + " -> " + mmr);
        return toDTO(user);
    }

    @CacheEvict(value = { "users", "allUsers" }, key = "#id", allEntries = true)
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
        logService.log("INFO", "User deleted: " + user.getUsername());
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setDisplayName(user.getDisplayName());
        dto.setMmr(user.getMmr());
        return dto;
    }
}
