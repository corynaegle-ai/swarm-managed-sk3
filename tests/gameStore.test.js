import { get } from 'svelte/store';
import { gameStore, handsThisRound, gameInProgress, canAdvanceRound } from '../src/store/gameStore.js';

describe('Game Store', () => {
  beforeEach(() => {
    gameStore.reset();
  });

  test('initializes with correct default state', () => {
    const state = get(gameStore);
    expect(state.currentRound).toBe(1);
    expect(state.isGameComplete).toBe(false);
    expect(state.finalScores).toEqual({});
  });

  test('tracks current round from 1-10', () => {
    const state = get(gameStore);
    expect(state.currentRound).toBe(1);
    
    gameStore.updateRound();
    expect(get(gameStore).currentRound).toBe(2);
  });

  test('hands this round equals current round number', () => {
    expect(get(handsThisRound)).toBe(1);
    
    gameStore.updateRound();
    expect(get(handsThisRound)).toBe(2);
    
    gameStore.updateRound();
    expect(get(handsThisRound)).toBe(3);
  });

  test('marks game complete after round 10', () => {
    // Advance to round 10
    for (let i = 1; i < 10; i++) {
      gameStore.updateRound();
    }
    
    expect(get(gameStore).currentRound).toBe(10);
    expect(get(gameStore).isGameComplete).toBe(false);
    
    // Try to advance past round 10
    gameStore.updateRound();
    expect(get(gameStore).isGameComplete).toBe(true);
    expect(get(gameStore).currentRound).toBe(10);
  });

  test('prevents exceeding round 10', () => {
    // Advance to round 10 and complete game
    for (let i = 1; i < 10; i++) {
      gameStore.updateRound();
    }
    gameStore.updateRound(); // This should complete the game
    
    const stateBefore = get(gameStore);
    gameStore.updateRound(); // This should not change anything
    const stateAfter = get(gameStore);
    
    expect(stateBefore).toEqual(stateAfter);
    expect(stateAfter.currentRound).toBe(10);
    expect(stateAfter.isGameComplete).toBe(true);
  });

  test('derived stores work correctly', () => {
    expect(get(gameInProgress)).toBe(true);
    expect(get(canAdvanceRound)).toBe(true);
    
    // Complete the game
    for (let i = 1; i < 10; i++) {
      gameStore.updateRound();
    }
    gameStore.updateRound();
    
    expect(get(gameInProgress)).toBe(false);
    expect(get(canAdvanceRound)).toBe(false);
  });
});