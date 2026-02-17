import GameState from '../../src/game/gameState.js';
import { calculateStandardBidScore } from '../../src/scoring/standardScoring.js';

// Mock the scoring function
jest.mock('../../src/scoring/standardScoring.js', () => ({
  calculateStandardBidScore: jest.fn()
}));

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
    jest.clearAllMocks();
  });

  describe('updatePlayerScores', () => {
    beforeEach(() => {
      // Setup game with players
      gameState.addPlayer('player1', 'Alice');
      gameState.addPlayer('player2', 'Bob');
      
      // Start a round
      gameState.startRound(1, 5);
      
      // Record bids and tricks
      gameState.recordBid('player1', 3);
      gameState.recordBid('player2', 2);
      gameState.recordTricks('player1', 3);
      gameState.recordTricks('player2', 1);
    });

    test('should import and use calculateStandardBidScore function', () => {
      // Mock return values
      calculateStandardBidScore.mockReturnValueOnce(13); // bid=3, tricks=3
      calculateStandardBidScore.mockReturnValueOnce(2);  // bid=2, tricks=1

      gameState.updatePlayerScores();

      // Verify the function was called with correct parameters
      expect(calculateStandardBidScore).toHaveBeenCalledTimes(2);
      expect(calculateStandardBidScore).toHaveBeenCalledWith(3, 3);
      expect(calculateStandardBidScore).toHaveBeenCalledWith(2, 1);
    });

    test('should update player total scores with calculated values', () => {
      calculateStandardBidScore.mockReturnValueOnce(13);
      calculateStandardBidScore.mockReturnValueOnce(2);

      gameState.updatePlayerScores();

      const standings = gameState.getStandings();
      expect(standings[0].totalScore).toBe(13);
      expect(standings[1].totalScore).toBe(2);
    });

    test('should store round scores correctly', () => {
      calculateStandardBidScore.mockReturnValueOnce(13);
      calculateStandardBidScore.mockReturnValueOnce(2);

      gameState.updatePlayerScores();

      const gameStateData = gameState.getGameState();
      expect(gameStateData.currentRound.scores.player1).toBe(13);
      expect(gameStateData.currentRound.scores.player2).toBe(2);
    });

    test('should throw error if bid data is missing', () => {
      gameState.startRound(2, 4);
      gameState.recordTricks('player1', 2);
      
      expect(() => gameState.updatePlayerScores()).toThrow(
        'Missing bid or tricks data for player player1'
      );
    });

    test('should throw error if tricks data is missing', () => {
      gameState.startRound(2, 4);
      gameState.recordBid('player1', 2);
      
      expect(() => gameState.updatePlayerScores()).toThrow(
        'Missing bid or tricks data for player player1'
      );
    });
  });

  describe('general game state functionality', () => {
    test('should add players correctly', () => {
      gameState.addPlayer('p1', 'Alice');
      gameState.addPlayer('p2', 'Bob');
      
      const state = gameState.getGameState();
      expect(state.players).toHaveLength(2);
      expect(state.players[0].name).toBe('Alice');
      expect(state.players[1].name).toBe('Bob');
    });

    test('should track round progression', () => {
      gameState.addPlayer('p1', 'Alice');
      gameState.startRound(1, 5);
      
      expect(gameState.getGameState().gamePhase).toBe('bidding');
      expect(gameState.getGameState().currentRound.number).toBe(1);
    });
  });
});