import {
  checkBidCollectionComplete,
  advanceToNextPhase,
  isValidPhaseTransition,
  validateBidCollectionState,
  getRemainingBidders,
  GAME_PHASES
} from '../gameLogic';

describe('gameLogic', () => {
  const mockPlayers = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    { id: 4, name: 'Player 4' }
  ];

  describe('checkBidCollectionComplete', () => {
    it('should return false when no bids exist', () => {
      expect(checkBidCollectionComplete({}, mockPlayers)).toBe(false);
    });

    it('should return false when not all players have bid', () => {
      const incompleteBids = { 1: 3, 2: 2 };
      expect(checkBidCollectionComplete(incompleteBids, mockPlayers)).toBe(false);
    });

    it('should return true when all players have valid bids', () => {
      const completeBids = { 1: 3, 2: 2, 3: 4, 4: 1 };
      expect(checkBidCollectionComplete(completeBids, mockPlayers)).toBe(true);
    });

    it('should return false when bids contain invalid values', () => {
      const invalidBids = { 1: 3, 2: 2, 3: 4, 4: -1 };
      expect(checkBidCollectionComplete(invalidBids, mockPlayers)).toBe(false);
    });
  });

  describe('advanceToNextPhase', () => {
    it('should advance from WAITING to COLLECTING_BIDS', () => {
      expect(advanceToNextPhase(GAME_PHASES.WAITING)).toBe(GAME_PHASES.COLLECTING_BIDS);
    });

    it('should advance from COLLECTING_BIDS to TRICK_TAKING', () => {
      expect(advanceToNextPhase(GAME_PHASES.COLLECTING_BIDS)).toBe(GAME_PHASES.TRICK_TAKING);
    });

    it('should advance from TRICK_TAKING to ROUND_COMPLETE', () => {
      expect(advanceToNextPhase(GAME_PHASES.TRICK_TAKING)).toBe(GAME_PHASES.ROUND_COMPLETE);
    });

    it('should advance from ROUND_COMPLETE to COLLECTING_BIDS', () => {
      expect(advanceToNextPhase(GAME_PHASES.ROUND_COMPLETE)).toBe(GAME_PHASES.COLLECTING_BIDS);
    });
  });

  describe('isValidPhaseTransition', () => {
    it('should validate correct phase transitions', () => {
      expect(isValidPhaseTransition(GAME_PHASES.WAITING, GAME_PHASES.COLLECTING_BIDS)).toBe(true);
      expect(isValidPhaseTransition(GAME_PHASES.COLLECTING_BIDS, GAME_PHASES.TRICK_TAKING)).toBe(true);
    });

    it('should reject invalid phase transitions', () => {
      expect(isValidPhaseTransition(GAME_PHASES.WAITING, GAME_PHASES.TRICK_TAKING)).toBe(false);
      expect(isValidPhaseTransition(GAME_PHASES.TRICK_TAKING, GAME_PHASES.COLLECTING_BIDS)).toBe(false);
    });
  });

  describe('getRemainingBidders', () => {
    it('should return players who have not bid yet', () => {
      const partialBids = { 1: 3, 3: 2 };
      const remaining = getRemainingBidders(partialBids, mockPlayers);
      expect(remaining).toHaveLength(2);
      expect(remaining.map(p => p.id)).toEqual([2, 4]);
    });

    it('should return empty array when all players have bid', () => {
      const completeBids = { 1: 3, 2: 2, 3: 4, 4: 1 };
      const remaining = getRemainingBidders(completeBids, mockPlayers);
      expect(remaining).toHaveLength(0);
    });
  });
});