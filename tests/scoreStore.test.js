import { describe, it, expect, beforeEach } from 'vitest';
import scoreStore from '../src/store/scoreStore.js';

describe('scoreStore', () => {
  beforeEach(() => {
    scoreStore.resetGame();
  });

  describe('Round Management', () => {
    it('should initialize a new round correctly', () => {
      scoreStore.initializeRound(2, 15);
      
      expect(scoreStore.currentRound).toBe(2);
      expect(scoreStore.gameConfig.handsPerRound).toBe(15);
      expect(scoreStore.currentRoundScores).toEqual({});
    });

    it('should track scores separately for each round', () => {
      // Round 1
      scoreStore.initializeRound(1, 10);
      scoreStore.updatePlayerScore('player1', 50);
      scoreStore.updatePlayerScore('player2', 30);
      scoreStore.completeRound();

      // Round 2
      scoreStore.initializeRound(2, 12);
      scoreStore.updatePlayerScore('player1', 60);
      scoreStore.updatePlayerScore('player2', 40);
      scoreStore.completeRound();

      const round1Scores = scoreStore.getRoundScores(1);
      const round2Scores = scoreStore.getRoundScores(2);

      expect(round1Scores.playerScores).toEqual({ player1: 50, player2: 30 });
      expect(round2Scores.playerScores).toEqual({ player1: 60, player2: 40 });
      expect(round1Scores.handsPlayed).toBe(10);
      expect(round2Scores.handsPlayed).toBe(12);
    });

    it('should preserve previous round scores during transitions', () => {
      scoreStore.initializeRound(1, 10);
      scoreStore.updatePlayerScore('player1', 50);
      scoreStore.nextRound(8);
      
      const round1Scores = scoreStore.getRoundScores(1);
      expect(round1Scores).toBeDefined();
      expect(round1Scores.playerScores.player1).toBe(50);
      expect(scoreStore.currentRound).toBe(2);
    });
  });

  describe('Dynamic Hand Counts', () => {
    it('should adapt to variable hand counts per round', () => {
      scoreStore.initializeRound(1, 5);
      scoreStore.updatePlayerScore('player1', 25);
      scoreStore.completeRound();

      scoreStore.initializeRound(2, 15);
      scoreStore.updatePlayerScore('player1', 75);
      scoreStore.completeRound();

      const avgPerHand = scoreStore.getAverageScorePerHand('player1');
      expect(avgPerHand).toBe(5); // (25 + 75) / (5 + 15)
    });
  });

  describe('Score History', () => {
    it('should maintain complete score history', () => {
      // Setup multiple rounds
      for (let round = 1; round <= 3; round++) {
        scoreStore.initializeRound(round, round * 5);
        scoreStore.updatePlayerScore('player1', round * 10);
        scoreStore.updatePlayerScore('player2', round * 8);
        scoreStore.completeRound();
      }

      const history = scoreStore.getScoreHistory();
      expect(history).toHaveLength(3);
      
      expect(history[0]).toEqual({
        round: 1,
        scores: { player1: 10, player2: 8 },
        hands: 5
      });
      
      expect(history[2]).toEqual({
        round: 3,
        scores: { player1: 30, player2: 24 },
        hands: 15
      });
    });

    it('should calculate total scores correctly', () => {
      scoreStore.initializeRound(1, 10);
      scoreStore.updatePlayerScore('player1', 50);
      scoreStore.updatePlayerScore('player2', 30);
      scoreStore.completeRound();

      scoreStore.initializeRound(2, 8);
      scoreStore.updatePlayerScore('player1', 40);
      scoreStore.updatePlayerScore('player2', 35);
      scoreStore.completeRound();

      const totals = scoreStore.getTotalScores();
      expect(totals).toEqual({ player1: 90, player2: 65 });
    });
  });
});