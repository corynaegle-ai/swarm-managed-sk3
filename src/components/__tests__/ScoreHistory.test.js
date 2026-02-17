import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreHistory from '../ScoreHistory';

describe('ScoreHistory', () => {
  const mockPlayers = [
    { id: 'player1', name: 'Alice' },
    { id: 'player2', name: 'Bob' }
  ];

  const mockHistory = [
    {
      round: 1,
      scores: { player1: 85, player2: 92 },
      timestamp: '2023-01-01T10:00:00Z'
    },
    {
      round: 2,
      scores: { player1: 78, player2: 88 },
      timestamp: '2023-01-01T10:15:00Z'
    }
  ];

  it('displays no history message when history is empty', () => {
    render(<ScoreHistory history={[]} players={mockPlayers} />);
    
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });

  it('renders history table with player names', () => {
    render(<ScoreHistory history={mockHistory} players={mockPlayers} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('displays round scores correctly', () => {
    render(<ScoreHistory history={mockHistory} players={mockPlayers} />);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('handles undefined history gracefully', () => {
    render(<ScoreHistory history={undefined} players={mockPlayers} />);
    
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });
});