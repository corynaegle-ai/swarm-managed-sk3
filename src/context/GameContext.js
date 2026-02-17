/**
 * Game Context for managing global game state
 */

import React, { createContext, useContext, useReducer } from 'react';
import { initializeGame, processRoundCompletion, validateRoundCompletion } from '../utils/gameLogic.js';

// Create the context
const GameContext = createContext();

// Action types
export const GAME_ACTIONS = {
  INITIALIZE_GAME: 'INITIALIZE_GAME',
  PLACE_BID: 'PLACE_BID',
  RECORD_TRICKS_TAKEN: 'RECORD_TRICKS_TAKEN',
  COMPLETE_ROUND: 'COMPLETE_ROUND',
  ADVANCE_PHASE: 'ADVANCE_PHASE',
  RESET_GAME: 'RESET_GAME',
  UPDATE_ROUND_DATA: 'UPDATE_ROUND_DATA'
};

// Initial state
const initialState = {
  gameState: null,
  loading: false,
  error: null
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.INITIALIZE_GAME:
      try {
        const gameState = initializeGame(action.payload.playerNames);
        return {
          ...state,
          gameState,
          loading: false,
          error: null
        };
      } catch (error) {
        return {
          ...state,
          loading: false,
          error: error.message
        };
      }

    case GAME_ACTIONS.PLACE_BID:
      if (!state.gameState) {
        return {
          ...state,
          error: 'No active game to place bid'
        };
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          roundData: {
            ...state.gameState.roundData,
            bids: {
              ...state.gameState.roundData.bids,
              [action.payload.playerId]: action.payload.bid
            }
          }
        },
        error: null
      };

    case GAME_ACTIONS.RECORD_TRICKS_TAKEN:
      if (!state.gameState) {
        return {
          ...state,
          error: 'No active game to record tricks'
        };
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          roundData: {
            ...state.gameState.roundData,
            tricksTaken: {
              ...state.gameState.roundData.tricksTaken,
              [action.payload.playerId]: action.payload.tricksTaken
            }
          }
        },
        error: null
      };

    case GAME_ACTIONS.COMPLETE_ROUND:
      if (!state.gameState) {
        return {
          ...state,
          error: 'No active game to complete round'
        };
      }

      try {
        // Validate round completion
        const validation = validateRoundCompletion(state.gameState);
        if (!validation.isValid) {
          return {
            ...state,
            error: `Round completion failed: ${validation.errors.join(', ')}`
          };
        }

        // Process round completion
        const updatedGameState = processRoundCompletion(
          state.gameState, 
          action.payload || {}
        );

        return {
          ...state,
          gameState: updatedGameState,
          error: null
        };
      } catch (error) {
        return {
          ...state,
          error: `Failed to complete round: ${error.message}`
        };
      }

    case GAME_ACTIONS.ADVANCE_PHASE:
      if (!state.gameState) {
        return {
          ...state,
          error: 'No active game to advance phase'
        };
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          gamePhase: action.payload.phase
        },
        error: null
      };

    case GAME_ACTIONS.UPDATE_ROUND_DATA:
      if (!state.gameState) {
        return {
          ...state,
          error: 'No active game to update round data'
        };
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          roundData: {
            ...state.gameState.roundData,
            ...action.payload
          }
        },
        error: null
      };

    case GAME_ACTIONS.RESET_GAME:
      return initialState;

    default:
      return state;
  }
}

// Context Provider Component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Action creators
  const gameActions = {
    initializeGame: (playerNames) => {
      dispatch({
        type: GAME_ACTIONS.INITIALIZE_GAME,
        payload: { playerNames }
      });
    },

    placeBid: (playerId, bid) => {
      dispatch({
        type: GAME_ACTIONS.PLACE_BID,
        payload: { playerId, bid }
      });
    },

    recordTricksTaken: (playerId, tricksTaken) => {
      dispatch({
        type: GAME_ACTIONS.RECORD_TRICKS_TAKEN,
        payload: { playerId, tricksTaken }
      });
    },

    completeRound: (roundResults = {}) => {
      dispatch({
        type: GAME_ACTIONS.COMPLETE_ROUND,
        payload: roundResults
      });
    },

    advancePhase: (phase) => {
      dispatch({
        type: GAME_ACTIONS.ADVANCE_PHASE,
        payload: { phase }
      });
    },

    updateRoundData: (roundData) => {
      dispatch({
        type: GAME_ACTIONS.UPDATE_ROUND_DATA,
        payload: roundData
      });
    },

    resetGame: () => {
      dispatch({ type: GAME_ACTIONS.RESET_GAME });
    }
  };

  const contextValue = {
    ...state,
    ...gameActions
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Selector hooks for specific game state pieces
export function useGameState() {
  const { gameState } = useGame();
  return gameState;
}

export function useCurrentRound() {
  const gameState = useGameState();
  return gameState?.currentRound || 0;
}

export function usePlayerScores() {
  const gameState = useGameState();
  return gameState?.players || [];
}

export function useGamePhase() {
  const gameState = useGameState();
  return gameState?.gamePhase || 'bidding';
}

export function useRoundData() {
  const gameState = useGameState();
  return gameState?.roundData || {
    bids: {},
    tricksTaken: {},
    currentTrick: [],
    tricksCompleted: 0
  };
}

export default GameContext;