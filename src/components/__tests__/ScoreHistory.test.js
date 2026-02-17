import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreHistory from '../ScoreHistory';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

const mockHistory = [
  {
    round: 1,
    scores: { '1': 25, '2': 30 },
    timestamp: '2024-01-01T12:00:00.000Z'
  },
  {
    round: 2,
    scores: { '1': 15, '2': 20 },
    timestamp: '2024-01-01T12:05:00.000Z'
  }
];

describe('ScoreHistory', () => {
  test('displays empty state when no history', () => {
    render(<ScoreHistory history={[]} players={mockPlayers} />);
    
    expect(screen.getByText('Score History')).toBeInTheDocument();
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });

  test('displays history rounds with scores', () => {
    render(<ScoreHistory history={mockHistory} players={mockPlayers} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
  });

  test('shows timestamps for rounds', () => {
    render(<ScoreHistory history={mockHistory} players={mockPlayers} />);
    
    // Check that timestamps are displayed (exact format may vary by locale)
    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/);
    expect(timestamps.length).toBeGreaterThan(0);
  });

  test('displays player scores for each round', () => {
    render(<ScoreHistory history={mockHistory} players={mockPlayers} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('shows expand/collapse button for long history', () => {
    const longHistory = Array.from({ length: 5 }, (_, i) => ({
      round: i + 1,
      scores: { '1': i * 10, '2': i * 15 },
      timestamp: `2024-01-01T12:${i.toString().padStart(2, '0')}:00.000Z`
    }));

    render(<ScoreHistory history={longHistory} players={mockPlayers} />);
    
    expect(screen.getByText('Show All (5 rounds)')).toBeInTheDocument();
  });

  test('expands and collapses history when button clicked', () => {
    const longHistory = Array.from({ length: 5 }, (_, i) => ({
      round: i + 1,
      scores: { '1': i * 10, '2': i * 15 },
      timestamp: `2024-01-01T12:${i.toString().padStart(2, '0')}:00.000Z`
    }));

    render(<ScoreHistory history={longHistory} players={mockPlayers} />);
    
    const expandButton = screen.getByText('Show All (5 rounds)');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('Show Less')).toBeInTheDocument();
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 5')).toBeInTheDocument();
  });

  test('shows summary for collapsed long history', () => {
    const longHistory = Array.from({ length: 5 }, (_, i) => ({
      round: i + 1,
      scores: { '1': i * 10, '2': i * 15 },
      timestamp: `2024-01-01T12:${i.toString().padStart(2, '0')}:00.000Z`
    }));

    render(<ScoreHistory history={longHistory} players={mockPlayers} />);
    
    expect(screen.getByText('Showing last 3 rounds of 5 total')).toBeInTheDocument();
  });

  test('handles missing player scores gracefully', () => {
    const historyWithMissingScores = [
      {
        round: 1,
        scores: { '1': 25 }, // Missing score for player 2
        timestamp: '2024-01-01T12:00:00.000Z'
      }
    ];

    render(<ScoreHistory history={historyWithMissingScores} players={mockPlayers} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Default for missing score
  });
});