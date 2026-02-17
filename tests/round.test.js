import { Round } from '../src/game/round';
import { GameState } from '../src/game/gameState';
import { calculateStandardBidScore } from '../src/scoring/standardScoring';

// Mock the standard scoring function
jest.mock('../src/scoring/standardScoring', () => ({
  calculateStandardBidScore: jest.fn((bid, tricks) => bid === tricks ? 10 + bid : 0)
}));

describe('Round', () => {
  let round;
  let gameState;
  let players;

  beforeEach(() => {
    players = [
      { id: 'player1', name: 'Player 1' },
      { id: 'player2', name: 'Player 2' }
    ];
    round = new Round(players);
    gameState = new GameState(players);
    jest.clearAllMocks();
  });

  test('should integrate standard scoring function', () => {
    round.setBid('player1', 2);
    round.setBid('player2', 1);
    
    // Mock tricks won
    round.addTrick({ winner: 'player1' });
    round.addTrick({ winner: 'player1' });
    round.addTrick({ winner: 'player2' });
    
    round.completeRound(gameState);
    
    expect(calculateStandardBidScore).toHaveBeenCalledWith(2, 2);
    expect(calculateStandardBidScore).toHaveBeenCalledWith(1, 1);
  });

  test('should pass calculated scores to game state', () => {
    const addScoreSpy = jest.spyOn(gameState, 'addScore');
    
    round.setBid('player1', 1);
    round.addTrick({ winner: 'player1' });
    
    round.completeRound(gameState);
    
    expect(addScoreSpy).toHaveBeenCalledWith('player1', 11); // 10 + 1 from mock
  });
});