import { calculateRoundScore, applyBonusPoints, calculateAllRoundScores, updateRunningTotals } from '../scoringCalculations.js';

describe('scoringCalculations', () => {
  describe('calculateRoundScore', () => {
    test('should return 10 + tricks when bid equals tricks taken', () => {
      expect(calculateRoundScore(3, 3)).toBe(13);
      expect(calculateRoundScore(0, 0)).toBe(10);
      expect(calculateRoundScore(5, 5)).toBe(15);
    });

    test('should return 0 when bid does not equal tricks taken', () => {
      expect(calculateRoundScore(3, 2)).toBe(0);
      expect(calculateRoundScore(2, 3)).toBe(0);
      expect(calculateRoundScore(0, 1)).toBe(0);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => calculateRoundScore('3', 3)).toThrow('Bid and tricks taken must be numbers');
      expect(() => calculateRoundScore(3, null)).toThrow('Bid and tricks taken must be numbers');
      expect(() => calculateRoundScore(-1, 3)).toThrow('Bid and tricks taken must be non-negative');
    });
  });

  describe('applyBonusPoints', () => {
    test('should add nil bid bonus for successful 0 bid', () => {
      expect(applyBonusPoints(10, 0, 0)).toBe(60);
    });

    test('should not add nil bid bonus for failed 0 bid', () => {
      expect(applyBonusPoints(0, 0, 1)).toBe(0);
    });

    test('should add perfect round bonus', () => {
      const roundInfo = { totalTricks: 5 };
      expect(applyBonusPoints(15, 5, 5, roundInfo)).toBe(35);
    });
  });

  describe('updateRunningTotals', () => {
    test('should update player totals correctly', () => {
      const currentTotals = [
        { playerId: 'player-0', totalScore: 20, roundsPlayed: 1, contractsMade: 1 }
      ];
      const roundScores = [
        { playerId: 'player-0', roundScore: 13, madeContract: true }
      ];
      
      const result = updateRunningTotals(currentTotals, roundScores);
      
      expect(result[0].totalScore).toBe(33);
      expect(result[0].roundsPlayed).toBe(2);
      expect(result[0].contractsMade).toBe(2);
    });
  });
});