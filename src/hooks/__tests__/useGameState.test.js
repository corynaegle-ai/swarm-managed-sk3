import { renderHook, act } from '@testing-library/react';
import { useGameState, GAME_PHASES } from '../useGameState';

describe('useGameState', () => {
  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.phase).toBe(GAME_PHASES.WAITING);
    expect(result.current.bidCollectionComplete).toBe(false);
    expect(result.current.bids).toEqual({});
  });

  test('should include COLLECTING_BIDS in game phases', () => {
    expect(GAME_PHASES.COLLECTING_BIDS).toBe('COLLECTING_BIDS');
  });

  test('should set bid collection complete status', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setBidCollectionComplete(true);
    });
    
    expect(result.current.bidCollectionComplete).toBe(true);
  });

  test('should prevent advancing from COLLECTING_BIDS when bids not complete', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setPhase(GAME_PHASES.COLLECTING_BIDS);
    });
    
    act(() => {
      result.current.setPhase(GAME_PHASES.TRICK_TAKING);
    });
    
    expect(result.current.phase).toBe(GAME_PHASES.COLLECTING_BIDS);
  });

  test('should allow advancing from COLLECTING_BIDS when bids are complete', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setPhase(GAME_PHASES.COLLECTING_BIDS);
      result.current.setBidCollectionComplete(true);
    });
    
    act(() => {
      result.current.setPhase(GAME_PHASES.TRICK_TAKING);
    });
    
    expect(result.current.phase).toBe(GAME_PHASES.TRICK_TAKING);
  });

  test('should automatically set bidCollectionComplete when all players bid', () => {
    const { result } = renderHook(() => useGameState());
    
    const players = [{ id: '1' }, { id: '2' }];
    
    act(() => {
      players.forEach(player => {
        result.current.addPlayer(player);
      });
    });
    
    act(() => {
      result.current.setBid('1', 3);
    });
    
    expect(result.current.bidCollectionComplete).toBe(false);
    
    act(() => {
      result.current.setBid('2', 2);
    });
    
    expect(result.current.bidCollectionComplete).toBe(true);
  });
});