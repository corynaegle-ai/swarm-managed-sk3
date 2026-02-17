import { calculateBonusPoints, calculateTotalScore, updateAllPlayerScores } from './scoring';

describe('Scoring utilities', () => {
  describe('calculateBonusPoints', () => {
    it('should return 10 bonus points for exact bid match', () => {
      const player = { bid: 5, actualScore: 5 };
      expect(calculateBonusPoints(player)).toBe(10);
    });
    
    it('should return 0 bonus points for incorrect bid', () => {
      const player = { bid: 5, actualScore: 3 };
      expect(calculateBonusPoints(player)).toBe(0);
    });
    
    it('should return 0 for invalid player data', () => {
      expect(calculateBonusPoints(null)).toBe(0);
      expect(calculateBonusPoints({})).toBe(0);
      expect(calculateBonusPoints({ bid: 'invalid' })).toBe(0);
    });
  });
  
  describe('calculateTotalScore', () => {
    it('should calculate total score with bonus', () => {
      const player = { baseScore: 20, bid: 5, actualScore: 5 };
      const result = calculateTotalScore(player);
      expect(result.totalScore).toBe(30);
      expect(result.bonusPoints).toBe(10);
    });
    
    it('should calculate total score without bonus', () => {
      const player = { baseScore: 20, bid: 5, actualScore: 3 };
      const result = calculateTotalScore(player);
      expect(result.totalScore).toBe(20);
      expect(result.bonusPoints).toBe(0);
    });
  });
});