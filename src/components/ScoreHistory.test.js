import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreHistory from './ScoreHistory';

describe('ScoreHistory Component', () => {
  test('renders empty state when no history provided', () => {
    render(<ScoreHistory />);
    expect(screen.getByText('No previous rounds to display')).toBeInTheDocument();
  });

  test('renders empty state when empty array provided', () => {
    render(<ScoreHistory scoreHistory={[]} />);
    expect(screen.getByText('No previous rounds to display')).toBeInTheDocument();
  });

  test('renders score history with round numbers and scores', () => {
    const mockHistory = [
      { roundNumber: 1, score: 85 },
      { roundNumber: 2, score: 92 },
      { roundNumber: 3, score: 78 }
    ];
    
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  test('handles simple score array format', () => {
    const mockHistory = [75, 88, 91];
    
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    const mockHistory = [{ roundNumber: 1, score: 85 }];
    
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Previous round scores');
  });
});