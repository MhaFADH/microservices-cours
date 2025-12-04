package com.example.economy.controller;

import com.example.economy.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LogsController {

    private final LogService logService;

    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, String>>> getLogs() {
        return ResponseEntity.ok(logService.getLogs());
    }
}
