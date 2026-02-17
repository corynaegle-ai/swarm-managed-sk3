const { calculateStandardBidScore } = require('../../src/game/scoring');

describe('calculateStandardBidScore', () => {
  // Test that function exists and is properly exported
  test('function exists and is callable', () => {
    expect(typeof calculateStandardBidScore).toBe('function');
  });

  describe('Basic scoring scenarios', () => {
    test('exact bid match scores correctly', () => {
      // When bid equals tricks taken, score = 10 + bid
      expect(calculateStandardBidScore(3, 3)).toBe(13);
      expect(calculateStandardBidScore(5, 5)).toBe(15);
      expect(calculateStandardBidScore(1, 1)).toBe(11);
    });

    test('bid mismatch scores correctly', () => {
      // When bid doesn't match tricks, score = tricks taken only
      expect(calculateStandardBidScore(3, 2)).toBe(2);
      expect(calculateStandardBidScore(2, 4)).toBe(4);
      expect(calculateStandardBidScore(5, 3)).toBe(3);
    });

    test('zero bid scenarios', () => {
      // Zero bid with zero tricks should score 10 (exact match)
      expect(calculateStandardBidScore(0, 0)).toBe(10);
      // Zero bid with non-zero tricks should score tricks only
      expect(calculateStandardBidScore(0, 2)).toBe(2);
    });
  });

  describe('Edge cases and input validation', () => {
    test('handles large valid numbers', () => {
      expect(calculateStandardBidScore(10, 10)).toBe(20);
      expect(calculateStandardBidScore(13, 13)).toBe(23);
    });

    test('rejects negative bid values', () => {
      expect(() => calculateStandardBidScore(-1, 2)).toThrow('Invalid bid: must be non-negative');
      expect(() => calculateStandardBidScore(-5, 0)).toThrow('Invalid bid: must be non-negative');
    });

    test('rejects negative tricks values', () => {
      expect(() => calculateStandardBidScore(2, -1)).toThrow('Invalid tricks: must be non-negative');
      expect(() => calculateStandardBidScore(0, -3)).toThrow('Invalid tricks: must be non-negative');
    });

    test('rejects non-numeric inputs', () => {
      expect(() => calculateStandardBidScore('3', 2)).toThrow('Invalid input: bid and tricks must be numbers');
      expect(() => calculateStandardBidScore(2, '3')).toThrow('Invalid input: bid and tricks must be numbers');
      expect(() => calculateStandardBidScore(null, 2)).toThrow('Invalid input: bid and tricks must be numbers');
      expect(() => calculateStandardBidScore(2, undefined)).toThrow('Invalid input: bid and tricks must be numbers');
    });

    test('rejects NaN and Infinity', () => {
      expect(() => calculateStandardBidScore(NaN, 2)).toThrow('Invalid input: bid and tricks must be finite numbers');
      expect(() => calculateStandardBidScore(2, NaN)).toThrow('Invalid input: bid and tricks must be finite numbers');
      expect(() => calculateStandardBidScore(Infinity, 2)).toThrow('Invalid input: bid and tricks must be finite numbers');
      expect(() => calculateStandardBidScore(2, -Infinity)).toThrow('Invalid input: bid and tricks must be finite numbers');
    });
  });

  describe('Complex scenarios', () => {
    test('multiple exact matches in sequence', () => {
      const testCases = [
        [1, 1, 11],
        [2, 2, 12],
        [3, 3, 13],
        [4, 4, 14]
      ];
      
      testCases.forEach(([bid, tricks, expected]) => {
        expect(calculateStandardBidScore(bid, tricks)).toBe(expected);
      });
    });

    test('multiple mismatches in sequence', () => {
      const testCases = [
        [1, 2, 2],
        [2, 1, 1],
        [3, 5, 5],
        [5, 3, 3]
      ];
      
      testCases.forEach(([bid, tricks, expected]) => {
        expect(calculateStandardBidScore(bid, tricks)).toBe(expected);
      });
    });
  });

  describe('Boundary conditions', () => {
    test('maximum reasonable card game values', () => {
      // Assuming standard deck scenarios
      expect(calculateStandardBidScore(13, 13)).toBe(26); // All spades bid and made
      expect(calculateStandardBidScore(13, 12)).toBe(12); // Close miss
    });

    test('minimum valid values', () => {
      expect(calculateStandardBidScore(0, 0)).toBe(10); // Nil bid made
      expect(calculateStandardBidScore(1, 1)).toBe(11); // Minimum positive bid made
    });
  });
});
