/**
 * Game Logic Utilities for Bid Collection and Phase Management
 */

/**
 * Validates that all players have submitted their bids
 * @param {Object} bids - Object containing player bids {playerId: bidValue}
 * @param {number} playerCount - Total number of players in the game
 * @returns {boolean} - True if all players have bid, false otherwise
 */
export function validateAllBidsCollected(bids, playerCount) {
  if (!bids || typeof bids !== 'object') {
    return false;
  }
  
  if (!playerCount || playerCount <= 0) {
    return false;
  }
  
  const bidKeys = Object.keys(bids);
  const validBids = bidKeys.filter(key => 
    bids[key] !== null && 
    bids[key] !== undefined && 
    typeof bids[key] === 'number' && 
    bids[key] >= 0
  );
  
  return validBids.length === playerCount;
}

/**
 * Checks if bid collection is complete for the current game state
 * @param {Object} gameState - Current game state object
 * @returns {boolean} - True if bid collection is complete
 */
export function checkBidCollectionComplete(gameState) {
  if (!gameState || !gameState.players || !gameState.currentRound) {
    return false;
  }
  
  const { players, currentRound } = gameState;
  const playerCount = Object.keys(players).length;
  const bids = currentRound.bids || {};
  
  return validateAllBidsCollected(bids, playerCount);
}

/**
 * Advances game state from bidding phase to trick-taking phase
 * @param {Object} gameState - Current game state object
 * @returns {Object} - Updated game state
 */
export function advanceFromBiddingPhase(gameState) {
  if (!gameState) {
    throw new Error('Game state is required');
  }
  
  if (!checkBidCollectionComplete(gameState)) {
    throw new Error('Cannot advance phase: bid collection is not complete');
  }
  
  return {
    ...gameState,
    phase: 'playing',
    currentRound: {
      ...gameState.currentRound,
      biddingComplete: true,
      tricks: [],
      currentTrick: {
        cards: {},
        leadPlayer: gameState.currentRound.dealer || Object.keys(gameState.players)[0]
      }
    }
  };
}

/**
 * Resets bid collection for a new round
 * @param {Object} gameState - Current game state object
 * @returns {Object} - Updated game state with reset bid collection
 */
export function resetBidCollection(gameState) {
  if (!gameState) {
    throw new Error('Game state is required');
  }
  
  return {
    ...gameState,
    phase: 'bidding',
    currentRound: {
      ...gameState.currentRound,
      bids: {},
      biddingComplete: false,
      tricks: [],
      currentTrick: null
    }
  };
}

/**
 * Gets the completion percentage of bid collection
 * @param {Object} gameState - Current game state object
 * @returns {number} - Percentage of bids collected (0-100)
 */
export function getBidCollectionStatus(gameState) {
  if (!gameState || !gameState.players || !gameState.currentRound) {
    return 0;
  }
  
  const { players, currentRound } = gameState;
  const playerCount = Object.keys(players).length;
  const bids = currentRound.bids || {};
  
  if (playerCount === 0) {
    return 0;
  }
  
  const validBids = Object.keys(bids).filter(key => 
    bids[key] !== null && 
    bids[key] !== undefined && 
    typeof bids[key] === 'number' && 
    bids[key] >= 0
  );
  
  return Math.round((validBids.length / playerCount) * 100);
}

/**
 * Helper function to get the current bidding player
 * @param {Object} gameState - Current game state object
 * @returns {string|null} - Player ID of current bidder or null if complete
 */
export function getCurrentBiddingPlayer(gameState) {
  if (!gameState || !gameState.players || !gameState.currentRound) {
    return null;
  }
  
  const { players, currentRound } = gameState;
  const playerIds = Object.keys(players);
  const bids = currentRound.bids || {};
  
  // Find first player who hasn't bid yet
  for (const playerId of playerIds) {
    if (bids[playerId] === null || bids[playerId] === undefined) {
      return playerId;
    }
  }
  
  return null; // All players have bid
}