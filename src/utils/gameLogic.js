/**
 * Game logic utilities for state management and round processing
 */

import { calculateAllRoundScores, updateRunningTotals } from './scoringCalculations.js';

/**
 * Initialize a new game state
 * @param {Array} playerNames - Array of player names
 * @returns {Object} - Initial game state
 */
export function initializeGame(playerNames) {
  if (!Array.isArray(playerNames) || playerNames.length === 0) {
    throw new Error('Player names must be a non-empty array');
  }

  const players = playerNames.map((name, index) => ({
    id: `player-${index}`,
    name: name,
    totalScore: 0,
    roundsPlayed: 0,
    contractsMade: 0
  }));

  return {
    players,
    currentRound: 1,
    maxRounds: 10,
    gamePhase: 'bidding', // 'bidding', 'playing', 'scoring', 'completed'
    roundData: {
      bids: {},
      tricksTaken: {},
      currentTrick: [],
      tricksCompleted: 0
    },
    gameHistory: [],
    gameId: `game-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
}

/**
 * Process the completion of a round
 * @param {Object} gameState - Current game state
 * @param {Object} roundResults - Results of the completed round
 * @returns {Object} - Updated game state
 */
export function processRoundCompletion(gameState, roundResults) {
  if (!gameState || !roundResults) {
    throw new Error('Game state and round results are required');
  }

  // Extract player round data
  const playersRoundData = gameState.players.map(player => ({
    id: player.id,
    bid: gameState.roundData.bids[player.id] || 0,
    tricksTaken: gameState.roundData.tricksTaken[player.id] || 0
  }));

  // Calculate round scores
  const roundScores = calculateAllRoundScores(playersRoundData, {
    roundNumber: gameState.currentRound,
    totalTricks: gameState.roundData.tricksCompleted
  });

  // Update running totals
  const updatedPlayers = updateRunningTotals(gameState.players, roundScores);

  // Create round history entry
  const roundHistory = {
    roundNumber: gameState.currentRound,
    bids: { ...gameState.roundData.bids },
    tricksTaken: { ...gameState.roundData.tricksTaken },
    scores: roundScores,
    completedAt: new Date().toISOString()
  };

  // Determine next phase
  const nextRound = gameState.currentRound + 1;
  const isGameComplete = nextRound > gameState.maxRounds;
  const nextPhase = isGameComplete ? 'completed' : 'bidding';

  return {
    ...gameState,
    players: updatedPlayers,
    currentRound: isGameComplete ? gameState.currentRound : nextRound,
    gamePhase: nextPhase,
    roundData: isGameComplete ? gameState.roundData : {
      bids: {},
      tricksTaken: {},
      currentTrick: [],
      tricksCompleted: 0
    },
    gameHistory: [...gameState.gameHistory, roundHistory]
  };
}

/**
 * Validate that a round is ready for completion
 * @param {Object} gameState - Current game state
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateRoundCompletion(gameState) {
  const errors = [];

  if (!gameState) {
    return { isValid: false, errors: ['Game state is required'] };
  }

  // Check that all players have bids
  const missingBids = gameState.players.filter(player => 
    !(player.id in gameState.roundData.bids)
  );
  
  if (missingBids.length > 0) {
    errors.push(`Missing bids for players: ${missingBids.map(p => p.name).join(', ')}`);
  }

  // Check that all players have tricks taken recorded
  const missingTricks = gameState.players.filter(player => 
    !(player.id in gameState.roundData.tricksTaken)
  );
  
  if (missingTricks.length > 0) {
    errors.push(`Missing tricks taken for players: ${missingTricks.map(p => p.name).join(', ')}`);
  }

  // Validate that tricks taken sum matches expected total
  const totalTricksTaken = Object.values(gameState.roundData.tricksTaken)
    .reduce((sum, tricks) => sum + tricks, 0);
  
  if (totalTricksTaken !== gameState.roundData.tricksCompleted && gameState.roundData.tricksCompleted > 0) {
    errors.push(`Tricks taken (${totalTricksTaken}) doesn't match completed tricks (${gameState.roundData.tricksCompleted})`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get current game statistics
 * @param {Object} gameState - Current game state
 * @returns {Object} - Game statistics
 */
export function getGameStatistics(gameState) {
  if (!gameState || !gameState.players) {
    return null;
  }

  const sortedPlayers = [...gameState.players]
    .sort((a, b) => b.totalScore - a.totalScore);

  return {
    leadingPlayer: sortedPlayers[0],
    playerRankings: sortedPlayers,
    roundsCompleted: gameState.gameHistory.length,
    roundsRemaining: Math.max(0, gameState.maxRounds - gameState.gameHistory.length),
    gameProgress: (gameState.gameHistory.length / gameState.maxRounds) * 100
  };
}