import { writable, derived } from 'svelte/store';

// Game state store
function createGameStore() {
  const { subscribe, set, update } = writable({
    currentRound: 1,
    isGameComplete: false,
    finalScores: {},
    players: [],
    scores: {}
  });

  return {
    subscribe,
    
    // Initialize game with players
    initializeGame: (playerNames) => {
      const initialScores = {};
      playerNames.forEach(name => {
        initialScores[name] = 0;
      });
      
      set({
        currentRound: 1,
        isGameComplete: false,
        finalScores: {},
        players: playerNames,
        scores: initialScores
      });
    },
    
    // Update to next round
    updateRound: () => {
      update(state => {
        if (state.currentRound >= 10) {
          return {
            ...state,
            isGameComplete: true,
            finalScores: { ...state.scores }
          };
        }
        
        return {
          ...state,
          currentRound: state.currentRound + 1
        };
      });
    },
    
    // Update player scores
    updateScores: (roundScores) => {
      update(state => {
        const newScores = { ...state.scores };
        Object.keys(roundScores).forEach(player => {
          newScores[player] = (newScores[player] || 0) + roundScores[player];
        });
        
        return {
          ...state,
          scores: newScores
        };
      });
    },
    
    // Reset game state
    reset: () => {
      set({
        currentRound: 1,
        isGameComplete: false,
        finalScores: {},
        players: [],
        scores: {}
      });
    }
  };
}

// Create the store instance
export const gameStore = createGameStore();

// Derived store for hands this round (equals current round number)
export const handsThisRound = derived(
  gameStore,
  ($gameStore) => $gameStore.currentRound
);

// Derived store to check if game is in progress
export const gameInProgress = derived(
  gameStore,
  ($gameStore) => $gameStore.currentRound > 0 && !$gameStore.isGameComplete
);

// Derived store for current round validation
export const canAdvanceRound = derived(
  gameStore,
  ($gameStore) => $gameStore.currentRound < 10 && !$gameStore.isGameComplete
);