/**
 * Scoring calculations for the card game
 * Handles bid vs tricks scoring, bonuses, and round completion
 */

/**
 * Calculate score for a single round based on bid vs tricks taken
 * @param {number} bid - Player's bid for the round
 * @param {number} tricksTaken - Actual tricks taken by player
 * @returns {number} - Round score
 */
export function calculateRoundScore(bid, tricksTaken) {
  if (typeof bid !== 'number' || typeof tricksTaken !== 'number') {
    throw new Error('Bid and tricks taken must be numbers');
  }

  if (bid < 0 || tricksTaken < 0) {
    throw new Error('Bid and tricks taken must be non-negative');
  }

  // Basic scoring: 10 points for making bid exactly, plus 1 point per trick
  if (bid === tricksTaken) {
    return 10 + tricksTaken;
  }
  
  // Penalty for not making bid: 0 points
  return 0;
}

/**
 * Apply bonus points based on special conditions
 * @param {number} baseScore - Base round score
 * @param {number} bid - Player's bid
 * @param {number} tricksTaken - Tricks taken
 * @param {Object} roundInfo - Additional round context
 * @returns {number} - Score with bonuses applied
 */
export function applyBonusPoints(baseScore, bid, tricksTaken, roundInfo = {}) {
  let bonusScore = baseScore;
  
  // Nil bid bonus (bidding 0 and taking 0)
  if (bid === 0 && tricksTaken === 0) {
    bonusScore += 50; // Significant bonus for successful nil bid
  }
  
  // Perfect round bonus (bid equals total tricks in round)
  if (roundInfo.totalTricks && bid === roundInfo.totalTricks) {
    bonusScore += 20;
  }
  
  return bonusScore;
}

/**
 * Calculate scores for all players in a round
 * @param {Array} players - Array of player objects with bid and tricksTaken
 * @param {Object} roundInfo - Round context information
 * @returns {Array} - Array of score objects for each player
 */
export function calculateAllRoundScores(players, roundInfo = {}) {
  if (!Array.isArray(players)) {
    throw new Error('Players must be an array');
  }

  return players.map((player, index) => {
    const baseScore = calculateRoundScore(player.bid, player.tricksTaken);
    const finalScore = applyBonusPoints(baseScore, player.bid, player.tricksTaken, roundInfo);
    
    return {
      playerId: player.id || index,
      bid: player.bid,
      tricksTaken: player.tricksTaken,
      roundScore: finalScore,
      madeContract: player.bid === player.tricksTaken
    };
  });
}

/**
 * Update running totals for all players
 * @param {Array} currentTotals - Current game totals for all players
 * @param {Array} roundScores - Scores from the completed round
 * @returns {Array} - Updated totals
 */
export function updateRunningTotals(currentTotals, roundScores) {
  if (!Array.isArray(currentTotals) || !Array.isArray(roundScores)) {
    throw new Error('Both currentTotals and roundScores must be arrays');
  }

  return currentTotals.map((playerTotal, index) => {
    const roundScore = roundScores.find(score => score.playerId === playerTotal.playerId) || 
                      roundScores[index];
    
    if (!roundScore) {
      throw new Error(`No round score found for player ${playerTotal.playerId}`);
    }

    return {
      ...playerTotal,
      totalScore: playerTotal.totalScore + roundScore.roundScore,
      roundsPlayed: playerTotal.roundsPlayed + 1,
      contractsMade: playerTotal.contractsMade + (roundScore.madeContract ? 1 : 0)
    };
  });
}