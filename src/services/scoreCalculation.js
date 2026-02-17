/**
 * Score calculation service
 * Handles scoring logic for both zero and non-zero bids
 */

/**
 * Calculate score based on bid value
 * @param {number} bid - The bid amount
 * @param {Object} additionalParams - Additional parameters for scoring
 * @returns {number} Calculated score
 */
function calculateScore(bid, additionalParams = {}) {
  // Validate input
  if (typeof bid !== 'number' || bid < 0) {
    throw new Error('Bid must be a non-negative number');
  }

  // Handle zero bid case
  if (bid === 0) {
    // Zero bid gets special scoring logic
    return 0;
  }

  // Original scoring formula for non-zero bids
  const baseScore = bid * 10;
  const multiplier = additionalParams.multiplier || 1;
  const bonus = additionalParams.bonus || 0;
  
  return (baseScore * multiplier) + bonus;
}

/**
 * Advanced score calculation with additional factors
 * @param {number} bid - The bid amount
 * @param {Object} factors - Scoring factors
 * @returns {number} Calculated score
 */
function calculateAdvancedScore(bid, factors = {}) {
  // Validate input
  if (typeof bid !== 'number' || bid < 0) {
    throw new Error('Bid must be a non-negative number');
  }

  // Handle zero bid case - special logic
  if (bid === 0) {
    return factors.zeroBaseScore || 0;
  }

  // Original scoring logic for non-zero bids
  const { weight = 1, adjustment = 0, threshold = 0 } = factors;
  let score = bid * weight + adjustment;
  
  // Apply threshold bonus for higher bids
  if (bid > threshold) {
    score += (bid - threshold) * 0.1;
  }
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

module.exports = {
  calculateScore,
  calculateAdvancedScore
};