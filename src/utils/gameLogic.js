// Game phase constants
export const GAME_PHASES = {
  WAITING: 'WAITING',
  COLLECTING_BIDS: 'COLLECTING_BIDS',
  TRICK_TAKING: 'TRICK_TAKING',
  ROUND_COMPLETE: 'ROUND_COMPLETE'
};

// Check if bid collection is complete for all players
export const checkBidCollectionComplete = (bids, players) => {
  if (!bids || !players || players.length === 0) {
    return false;
  }

  // Check that every player has submitted a bid
  for (const player of players) {
    if (!(player.id in bids) || bids[player.id] === undefined || bids[player.id] === null) {
      return false;
    }
  }

  // Validate bid values are reasonable (0-13 for spades)
  for (const playerId in bids) {
    const bid = bids[playerId];
    if (typeof bid !== 'number' || bid < 0 || bid > 13) {
      return false;
    }
  }

  return true;
};

// Advance to the next game phase
export const advanceToNextPhase = (currentPhase) => {
  switch (currentPhase) {
    case GAME_PHASES.WAITING:
      return GAME_PHASES.COLLECTING_BIDS;
    case GAME_PHASES.COLLECTING_BIDS:
      return GAME_PHASES.TRICK_TAKING;
    case GAME_PHASES.TRICK_TAKING:
      return GAME_PHASES.ROUND_COMPLETE;
    case GAME_PHASES.ROUND_COMPLETE:
      return GAME_PHASES.COLLECTING_BIDS;
    default:
      return GAME_PHASES.WAITING;
  }
};

// Validate that phase transition is allowed
export const isValidPhaseTransition = (currentPhase, nextPhase) => {
  const validTransitions = {
    [GAME_PHASES.WAITING]: [GAME_PHASES.COLLECTING_BIDS],
    [GAME_PHASES.COLLECTING_BIDS]: [GAME_PHASES.TRICK_TAKING],
    [GAME_PHASES.TRICK_TAKING]: [GAME_PHASES.ROUND_COMPLETE],
    [GAME_PHASES.ROUND_COMPLETE]: [GAME_PHASES.COLLECTING_BIDS]
  };

  return validTransitions[currentPhase]?.includes(nextPhase) || false;
};

// Calculate total bids for a round
export const calculateTotalBids = (bids) => {
  return Object.values(bids).reduce((total, bid) => total + bid, 0);
};

// Validate bid collection state consistency
export const validateBidCollectionState = (gameState) => {
  const { currentPhase, bids, players } = gameState;

  if (currentPhase !== GAME_PHASES.COLLECTING_BIDS) {
    return true; // Not in bid collection phase, no validation needed
  }

  // Ensure bids object exists
  if (!bids) {
    return false;
  }

  // Ensure no invalid bids exist
  for (const playerId in bids) {
    const bid = bids[playerId];
    const player = players.find(p => p.id.toString() === playerId.toString());
    
    if (!player) {
      return false; // Bid for non-existent player
    }
    
    if (typeof bid !== 'number' || bid < 0 || bid > 13) {
      return false; // Invalid bid value
    }
  }

  return true;
};

// Get remaining players who haven't bid yet
export const getRemainingBidders = (bids, players) => {
  return players.filter(player => !(player.id in bids));
};

// Initialize new round state
export const initializeNewRound = (currentRound) => {
  return {
    currentPhase: GAME_PHASES.COLLECTING_BIDS,
    currentRound: currentRound + 1,
    bids: {},
    tricks: [],
    currentTrick: [],
    message: `Round ${currentRound + 1} started. Collecting bids...`
  };
};