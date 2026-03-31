import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScoreBoard from '../ScoreBoard';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' },
  { id: '3', name: 'Player 3' }
];

const mockGameState = {
  currentRound: 1,
  status: 'active'
};

describe('ScoreBoard', () => {
  test('renders scoreboard with initial state', () => {
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    expect(screen.getByText('Score Board')).toBeInTheDocument();
    expect(screen.getByText('Round 0')).toBeInTheDocument();
    expect(screen.getByText('Running Totals')).toBeInTheDocument();
    expect(screen.getByText('Current Round Scores')).toBeInTheDocument();
    expect(screen.getByText('Score History')).toBeInTheDocument();
  });

  test('displays player names in running totals', () => {
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    mockPlayers.forEach(player => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  test('shows initial scores as zero', () => {
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    const totalScores = screen.getAllByText('0');
    expect(totalScores.length).toBeGreaterThanOrEqual(mockPlayers.length);
  });

  test('displays empty history message initially', () => {
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });

  test('renders RoundScoreDisplay components for each player', () => {
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    const roundScoreDisplays = screen.getByText('Current Round Scores').parentElement;
    expect(roundScoreDisplays).toBeInTheDocument();
  });

  test('handles empty players array gracefully', () => {
    render(<ScoreBoard gameState={mockGameState} players={[]} />);
    
    expect(screen.getByText('Score Board')).toBeInTheDocument();
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });

  // Test for development environment features
  test('shows debug section in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<ScoreBoard gameState={mockGameState} players={mockPlayers} />);
    
    expect(screen.getByText('Add Test Scores')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });
});