import {
  validateAllBidsCollected,
  checkBidCollectionComplete,
  advanceFromBiddingPhase,
  resetBidCollection,
  getBidCollectionStatus,
  getCurrentBiddingPlayer
} from './gameLogic.js';

describe('gameLogic utilities', () => {
  describe('validateAllBidsCollected', () => {
    test('returns true when all players have valid bids', () => {
      const bids = { player1: 3, player2: 2, player3: 1 };
      const result = validateAllBidsCollected(bids, 3);
      expect(result).toBe(true);
    });

    test('returns false when some players have not bid', () => {
      const bids = { player1: 3, player2: 2 };
      const result = validateAllBidsCollected(bids, 3);
      expect(result).toBe(false);
    });

    test('returns false when bids contain null values', () => {
      const bids = { player1: 3, player2: null, player3: 1 };
      const result = validateAllBidsCollected(bids, 3);
      expect(result).toBe(false);
    });
  });

  describe('checkBidCollectionComplete', () => {
    test('returns true when all players in game state have bid', () => {
      const gameState = {
        players: { player1: {}, player2: {} },
        currentRound: { bids: { player1: 2, player2: 1 } }
      };
      const result = checkBidCollectionComplete(gameState);
      expect(result).toBe(true);
    });

    test('returns false when not all players have bid', () => {
      const gameState = {
        players: { player1: {}, player2: {} },
        currentRound: { bids: { player1: 2 } }
      };
      const result = checkBidCollectionComplete(gameState);
      expect(result).toBe(false);
    });
  });

  describe('advanceFromBiddingPhase', () => {
    test('advances to playing phase when bids are complete', () => {
      const gameState = {
        players: { player1: {}, player2: {} },
        currentRound: { bids: { player1: 2, player2: 1 }, dealer: 'player1' },
        phase: 'bidding'
      };
      const result = advanceFromBiddingPhase(gameState);
      expect(result.phase).toBe('playing');
      expect(result.currentRound.biddingComplete).toBe(true);
    });

    test('throws error when bid collection is incomplete', () => {
      const gameState = {
        players: { player1: {}, player2: {} },
        currentRound: { bids: { player1: 2 } },
        phase: 'bidding'
      };
      expect(() => advanceFromBiddingPhase(gameState)).toThrow();
    });
  });

  describe('getBidCollectionStatus', () => {
    test('returns correct percentage for partial completion', () => {
      const gameState = {
        players: { player1: {}, player2: {}, player3: {}, player4: {} },
        currentRound: { bids: { player1: 2, player2: 1 } }
      };
      const result = getBidCollectionStatus(gameState);
      expect(result).toBe(50);
    });

    test('returns 100 for complete bid collection', () => {
      const gameState = {
        players: { player1: {}, player2: {} },
        currentRound: { bids: { player1: 2, player2: 1 } }
      };
      const result = getBidCollectionStatus(gameState);
      expect(result).toBe(100);
    });
  });
});