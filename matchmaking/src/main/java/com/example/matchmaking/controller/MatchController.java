package com.example.matchmaking.controller;

import com.example.matchmaking.dto.CompleteMatchDTO;
import com.example.matchmaking.entity.Match;
import com.example.matchmaking.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<Match> createMatch(@RequestBody Map<String, String> body) {
        String player1Id = body.get("player1Id");
        String player2Id = body.get("player2Id");
        Match match = matchService.createMatch(player1Id, player2Id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Match> completeMatch(@PathVariable String id, @RequestBody CompleteMatchDTO dto) {
        Match match = matchService.completeMatch(id, dto.getWinnerId());
        return ResponseEntity.ok(match);
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable String id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<Match>> getPlayerMatches(@PathVariable String playerId) {
        return ResponseEntity.ok(matchService.getPlayerMatches(playerId));
    }
}
