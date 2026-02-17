import { useState, useCallback } from 'react';

// Game phases enum
export const GAME_PHASES = {
  WAITING: 'WAITING',
  DEALING: 'DEALING',
  COLLECTING_BIDS: 'COLLECTING_BIDS',
  TRICK_TAKING: 'TRICK_TAKING',
  SCORING: 'SCORING',
  GAME_OVER: 'GAME_OVER'
};

// Initial game state
const initialGameState = {
  phase: GAME_PHASES.WAITING,
  currentPlayer: 0,
  players: [],
  deck: [],
  hands: {},
  currentTrick: [],
  scores: {},
  bids: {},
  bidCollectionComplete: false,
  tricksWon: {},
  round: 1
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // Set bid collection complete status
  const setBidCollectionComplete = useCallback((complete) => {
    setGameState(prev => ({
      ...prev,
      bidCollectionComplete: complete
    }));
  }, []);

  // Update game phase with validation
  const setPhase = useCallback((newPhase) => {
    setGameState(prev => {
      // Prevent advancing from COLLECTING_BIDS if bids aren't complete
      if (prev.phase === GAME_PHASES.COLLECTING_BIDS && 
          newPhase === GAME_PHASES.TRICK_TAKING && 
          !prev.bidCollectionComplete) {
        console.warn('Cannot advance to TRICK_TAKING phase: bid collection not complete');
        return prev;
      }
      
      return {
        ...prev,
        phase: newPhase
      };
    });
  }, []);

  // Add player to game
  const addPlayer = useCallback((player) => {
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, player],
      scores: { ...prev.scores, [player.id]: 0 },
      tricksWon: { ...prev.tricksWon, [player.id]: 0 }
    }));
  }, []);

  // Set player bid
  const setBid = useCallback((playerId, bid) => {
    setGameState(prev => {
      const newBids = { ...prev.bids, [playerId]: bid };
      const allPlayersHaveBid = prev.players.every(player => 
        newBids.hasOwnProperty(player.id)
      );
      
      return {
        ...prev,
        bids: newBids,
        bidCollectionComplete: allPlayersHaveBid
      };
    });
  }, []);

  // Deal cards to players
  const dealCards = useCallback((hands) => {
    setGameState(prev => ({
      ...prev,
      hands,
      phase: GAME_PHASES.COLLECTING_BIDS
    }));
  }, []);

  // Play card in current trick
  const playCard = useCallback((playerId, card) => {
    setGameState(prev => ({
      ...prev,
      currentTrick: [...prev.currentTrick, { playerId, card }],
      hands: {
        ...prev.hands,
        [playerId]: prev.hands[playerId].filter(c => c.id !== card.id)
      }
    }));
  }, []);

  // Complete current trick and award to winner
  const completeTrick = useCallback((winnerId) => {
    setGameState(prev => ({
      ...prev,
      currentTrick: [],
      tricksWon: {
        ...prev.tricksWon,
        [winnerId]: prev.tricksWon[winnerId] + 1
      },
      currentPlayer: winnerId
    }));
  }, []);

  // Update scores at end of round
  const updateScores = useCallback((newScores) => {
    setGameState(prev => ({
      ...prev,
      scores: { ...prev.scores, ...newScores },
      phase: GAME_PHASES.SCORING
    }));
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: GAME_PHASES.DEALING,
      currentTrick: [],
      bids: {},
      bidCollectionComplete: false,
      tricksWon: Object.keys(prev.tricksWon).reduce((acc, playerId) => {
        acc[playerId] = 0;
        return acc;
      }, {}),
      hands: {},
      round: prev.round + 1
    }));
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return {
    // State
    gameState,
    phase: gameState.phase,
    currentPlayer: gameState.currentPlayer,
    players: gameState.players,
    hands: gameState.hands,
    currentTrick: gameState.currentTrick,
    scores: gameState.scores,
    bids: gameState.bids,
    bidCollectionComplete: gameState.bidCollectionComplete,
    tricksWon: gameState.tricksWon,
    round: gameState.round,
    
    // Actions
    setPhase,
    setBidCollectionComplete,
    addPlayer,
    setBid,
    dealCards,
    playCard,
    completeTrick,
    updateScores,
    startNewRound,
    resetGame
  };
};

export default useGameState;