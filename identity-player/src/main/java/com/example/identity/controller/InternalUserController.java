package com.example.identity.controller;

import com.example.identity.dto.UserDTO;
import com.example.identity.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/mmr")
    public ResponseEntity<UserDTO> updateMmr(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        Integer mmr = body.get("mmr");
        return ResponseEntity.ok(userService.updateMmr(id, mmr));
    }
}
