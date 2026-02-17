const { calculateScore, calculateAdvancedScore } = require('../src/services/scoreCalculation');

describe('Score Calculation Service', () => {
  describe('calculateScore', () => {
    test('should handle zero bid correctly', () => {
      const result = calculateScore(0);
      expect(result).toBe(0);
    });

    test('should use original scoring logic for bid = 1', () => {
      const result = calculateScore(1);
      expect(result).toBe(10); // 1 * 10 = 10
    });

    test('should use original scoring logic for bid = 5', () => {
      const result = calculateScore(5);
      expect(result).toBe(50); // 5 * 10 = 50
    });

    test('should apply multiplier for non-zero bids', () => {
      const result = calculateScore(2, { multiplier: 2 });
      expect(result).toBe(40); // (2 * 10) * 2 = 40
    });

    test('should apply bonus for non-zero bids', () => {
      const result = calculateScore(3, { bonus: 5 });
      expect(result).toBe(35); // (3 * 10) + 5 = 35
    });

    test('should throw error for negative bids', () => {
      expect(() => calculateScore(-1)).toThrow('Bid must be a non-negative number');
    });

    test('should throw error for non-numeric bids', () => {
      expect(() => calculateScore('invalid')).toThrow('Bid must be a non-negative number');
    });
  });

  describe('calculateAdvancedScore', () => {
    test('should handle zero bid with special logic', () => {
      const result = calculateAdvancedScore(0, { zeroBaseScore: 10 });
      expect(result).toBe(10);
    });

    test('should use original logic for non-zero bids', () => {
      const result = calculateAdvancedScore(5, { weight: 2, adjustment: 3 });
      expect(result).toBe(13); // (5 * 2) + 3 = 13
    });

    test('should apply threshold bonus for higher bids', () => {
      const result = calculateAdvancedScore(15, { weight: 1, threshold: 10 });
      expect(result).toBe(15.5); // 15 + (15-10)*0.1 = 15.5
    });

    test('should not interfere zero logic with normal scoring', () => {
      // Test that zero bid logic doesn't affect normal bids
      const zeroResult = calculateAdvancedScore(0);
      const normalResult = calculateAdvancedScore(1);
      
      expect(zeroResult).toBe(0);
      expect(normalResult).toBe(1); // 1 * 1 + 0 = 1
    });
  });
});