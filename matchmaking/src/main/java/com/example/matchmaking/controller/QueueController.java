package com.example.matchmaking.controller;

import com.example.matchmaking.dto.JoinQueueDTO;
import com.example.matchmaking.entity.QueueEntry;
import com.example.matchmaking.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @PostMapping("/join")
    public ResponseEntity<QueueEntry> joinQueue(@RequestBody JoinQueueDTO dto) {
        QueueEntry entry = queueService.joinQueue(dto.getPlayerId());
        return ResponseEntity.ok(entry);
    }

    @PostMapping("/leave")
    public ResponseEntity<Map<String, String>> leaveQueue(@RequestBody JoinQueueDTO dto) {
        queueService.leaveQueue(dto.getPlayerId());
        return ResponseEntity.ok(Map.of("message", "Left queue successfully"));
    }

    @GetMapping
    public ResponseEntity<List<QueueEntry>> getQueue() {
        return ResponseEntity.ok(queueService.getQueue());
    }
}
