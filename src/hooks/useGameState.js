import { useState, useCallback } from 'react';

const initialGameState = {
  currentPhase: 'WAITING',
  currentRound: 0,
  players: [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
    { id: 4, name: 'Player 4', score: 0 }
  ],
  bids: {},
  tricks: [],
  currentTrick: [],
  message: 'Welcome to Spades! Click Start New Round to begin.'
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // Update game state with partial updates
  const updateGameState = useCallback((updates) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  // Reset game state to initial values
  const resetGameState = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  // Update specific player data
  const updatePlayer = useCallback((playerId, updates) => {
    setGameState(prevState => ({
      ...prevState,
      players: prevState.players.map(player =>
        player.id === playerId
          ? { ...player, ...updates }
          : player
      )
    }));
  }, []);

  // Add or update a bid for a specific player
  const updateBid = useCallback((playerId, bid) => {
    setGameState(prevState => ({
      ...prevState,
      bids: {
        ...prevState.bids,
        [playerId]: bid
      }
    }));
  }, []);

  // Add a completed trick to the game history
  const addTrick = useCallback((trick) => {
    setGameState(prevState => ({
      ...prevState,
      tricks: [...prevState.tricks, trick],
      currentTrick: []
    }));
  }, []);

  // Update the current trick being played
  const updateCurrentTrick = useCallback((card) => {
    setGameState(prevState => ({
      ...prevState,
      currentTrick: [...prevState.currentTrick, card]
    }));
  }, []);

  return {
    gameState,
    updateGameState,
    resetGameState,
    updatePlayer,
    updateBid,
    addTrick,
    updateCurrentTrick
  };
};