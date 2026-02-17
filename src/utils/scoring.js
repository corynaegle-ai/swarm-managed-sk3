/**
 * Scoring utilities for calculating player scores with bonus points
 */

/**
 * Calculate bonus points for a player
 * @param {Object} player - Player object with bid and actual score
 * @param {number} player.bid - Player's bid
 * @param {number} player.actualScore - Player's actual score
 * @returns {number} Bonus points (10 if bid exactly matches actual, 0 otherwise)
 */
export const calculateBonusPoints = (player) => {
  if (!player || typeof player.bid !== 'number' || typeof player.actualScore !== 'number') {
    return 0;
  }
  
  return player.bid === player.actualScore ? 10 : 0;
};

/**
 * Calculate total score including bonus points
 * @param {Object} player - Player object
 * @param {number} player.baseScore - Player's base score
 * @param {number} player.bid - Player's bid
 * @param {number} player.actualScore - Player's actual score
 * @returns {Object} Score breakdown with base, bonus, and total
 */
export const calculateTotalScore = (player) => {
  if (!player || typeof player.baseScore !== 'number') {
    return {
      baseScore: 0,
      bonusPoints: 0,
      totalScore: 0
    };
  }
  
  const bonusPoints = calculateBonusPoints(player);
  const totalScore = player.baseScore + bonusPoints;
  
  return {
    baseScore: player.baseScore,
    bonusPoints,
    totalScore
  };
};

/**
 * Update scores for all players in a game
 * @param {Array} players - Array of player objects
 * @returns {Array} Updated players with score breakdowns
 */
export const updateAllPlayerScores = (players) => {
  if (!Array.isArray(players)) {
    return [];
  }
  
  return players.map(player => {
    const scoreBreakdown = calculateTotalScore(player);
    return {
      ...player,
      ...scoreBreakdown
    };
  });
};