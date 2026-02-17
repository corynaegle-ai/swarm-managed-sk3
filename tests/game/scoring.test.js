const { calculateStandardBidScore } = require('../../src/game/scoring');

describe('calculateStandardBidScore', () => {
  describe('Valid bid scenarios', () => {
    it('should return correct score for exact bid match', () => {
      const result = calculateStandardBidScore(5, 5);
      expect(result).toBe(15); // 5 tricks + 10 bonus
    });

    it('should return correct score for successful underbid', () => {
      const result = calculateStandardBidScore(3, 5);
      expect(result).toBe(8); // 3 bid + 5 actual
    });

    it('should return negative score for failed bid', () => {
      const result = calculateStandardBidScore(5, 3);
      expect(result).toBe(-5); // -1 * bid amount
    });

    it('should handle zero bid correctly', () => {
      const result = calculateStandardBidScore(0, 0);
      expect(result).toBe(10); // 0 tricks + 10 bonus for exact match
    });

    it('should handle zero bid with tricks taken', () => {
      const result = calculateStandardBidScore(0, 3);
      expect(result).toBe(3); // 0 bid + 3 actual (underbid scenario)
    });

    it('should handle failed zero bid', () => {
      // This scenario is impossible in practice but tests edge case
      const result = calculateStandardBidScore(0, -1);
      expect(result).toBe(0); // -1 * 0 bid
    });
  });

  describe('Large number scenarios', () => {
    it('should handle large successful bids', () => {
      const result = calculateStandardBidScore(13, 13);
      expect(result).toBe(36); // 13 tricks + 10 bonus + 13 bid
    });

    it('should handle large failed bids', () => {
      const result = calculateStandardBidScore(10, 5);
      expect(result).toBe(-10); // -1 * 10 bid
    });

    it('should handle large underbids', () => {
      const result = calculateStandardBidScore(5, 13);
      expect(result).toBe(18); // 5 bid + 13 actual
    });
  });

  describe('Edge cases and invalid inputs', () => {
    it('should handle negative bid amounts', () => {
      const result = calculateStandardBidScore(-5, 3);
      expect(result).toBe(5); // -1 * -5 bid = 5
    });

    it('should handle negative tricks taken', () => {
      const result = calculateStandardBidScore(3, -2);
      expect(result).toBe(-3); // Failed bid: -1 * 3
    });

    it('should handle both negative values', () => {
      const result = calculateStandardBidScore(-3, -3);
      expect(result).toBe(7); // -3 tricks + 10 bonus for exact match
    });

    it('should handle floating point bids', () => {
      const result = calculateStandardBidScore(2.5, 3);
      expect(result).toBe(5.5); // 2.5 bid + 3 actual (underbid)
    });

    it('should handle floating point tricks', () => {
      const result = calculateStandardBidScore(3, 2.5);
      expect(result).toBe(-3); // Failed bid: -1 * 3
    });

    it('should handle string inputs that can be converted to numbers', () => {
      const result = calculateStandardBidScore('5', '5');
      expect(result).toBe(15); // Should convert and work like numbers
    });

    it('should handle null inputs', () => {
      expect(() => calculateStandardBidScore(null, 5)).toThrow();
      expect(() => calculateStandardBidScore(5, null)).toThrow();
    });

    it('should handle undefined inputs', () => {
      expect(() => calculateStandardBidScore(undefined, 5)).toThrow();
      expect(() => calculateStandardBidScore(5, undefined)).toThrow();
    });

    it('should handle non-numeric string inputs', () => {
      expect(() => calculateStandardBidScore('abc', 5)).toThrow();
      expect(() => calculateStandardBidScore(5, 'xyz')).toThrow();
    });

    it('should handle object inputs', () => {
      expect(() => calculateStandardBidScore({}, 5)).toThrow();
      expect(() => calculateStandardBidScore(5, {})).toThrow();
    });

    it('should handle array inputs', () => {
      expect(() => calculateStandardBidScore([], 5)).toThrow();
      expect(() => calculateStandardBidScore(5, [])).toThrow();
    });
  });

  describe('Boundary value testing', () => {
    it('should handle maximum safe integer values', () => {
      const maxInt = Number.MAX_SAFE_INTEGER;
      const result = calculateStandardBidScore(maxInt, maxInt);
      expect(result).toBe(maxInt + maxInt + 10); // bid + actual + bonus
    });

    it('should handle minimum safe integer values', () => {
      const minInt = Number.MIN_SAFE_INTEGER;
      const result = calculateStandardBidScore(minInt, minInt);
      expect(result).toBe(minInt + minInt + 10); // bid + actual + bonus for exact match
    });

    it('should handle infinity values', () => {
      expect(() => calculateStandardBidScore(Infinity, 5)).toThrow();
      expect(() => calculateStandardBidScore(5, Infinity)).toThrow();
      expect(() => calculateStandardBidScore(-Infinity, 5)).toThrow();
    });

    it('should handle NaN values', () => {
      expect(() => calculateStandardBidScore(NaN, 5)).toThrow();
      expect(() => calculateStandardBidScore(5, NaN)).toThrow();
    });
  });

  describe('Performance and stress testing', () => {
    it('should handle multiple rapid calculations', () => {
      const results = [];
      for (let i = 0; i < 1000; i++) {
        results.push(calculateStandardBidScore(i % 13, (i + 1) % 13));
      }
      expect(results).toHaveLength(1000);
      expect(results.every(r => typeof r === 'number')).toBe(true);
    });
  });
});