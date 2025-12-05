package com.example.matchmaking.service;

import com.example.matchmaking.entity.Match;
import com.example.matchmaking.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

    public Match createMatch(String player1Id, String player2Id) {
        Match match = new Match();
        match.setPlayer1Id(player1Id);
        match.setPlayer2Id(player2Id);
        match.setStatus(Match.MatchStatus.IN_PROGRESS);
        matchRepository.save(match);

        logService.log("INFO", "Match created: " + match.getId() + " between " + player1Id + " and " + player2Id);

        return match;
    }

    @Transactional
    public Match completeMatch(String matchId, String winnerId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != Match.MatchStatus.IN_PROGRESS) {
            throw new RuntimeException("Match already completed");
        }

        if (!winnerId.equals(match.getPlayer1Id()) && !winnerId.equals(match.getPlayer2Id())) {
            throw new RuntimeException("Winner must be one of the match players");
        }

        match.setWinnerId(winnerId);
        match.setStatus(Match.MatchStatus.COMPLETED);
        match.setCompletedAt(LocalDateTime.now());

        String loserId = winnerId.equals(match.getPlayer1Id()) ? match.getPlayer2Id() : match.getPlayer1Id();

        Map<String, Object> winner = identityClient.getUserById(winnerId);
        Map<String, Object> loser = identityClient.getUserById(loserId);

        Integer winnerMmr = (Integer) winner.get("mmr");
        Integer loserMmr = (Integer) loser.get("mmr");

        int mmrChange = 25;
        int newWinnerMmr = winnerMmr + mmrChange;
        int newLoserMmr = Math.max(0, loserMmr - mmrChange);

        identityClient.updateUserMmr(winnerId, newWinnerMmr);
        identityClient.updateUserMmr(loserId, newLoserMmr);

        match.setPlayer1MmrChange(winnerId.equals(match.getPlayer1Id()) ? mmrChange : -mmrChange);
        match.setPlayer2MmrChange(winnerId.equals(match.getPlayer2Id()) ? mmrChange : -mmrChange);

        matchRepository.save(match);
        logService.log("INFO", "Match completed: " + matchId + ", winner: " + winnerId);

        return match;
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(String id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));
    }

    public List<Match> getPlayerMatches(String playerId) {
        return matchRepository.findByPlayer1IdOrPlayer2Id(playerId, playerId);
    }
}
