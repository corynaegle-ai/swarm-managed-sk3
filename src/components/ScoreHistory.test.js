import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreHistory from './ScoreHistory';

describe('ScoreHistory', () => {
  test('renders empty state when no history provided', () => {
    render(<ScoreHistory />);
    expect(screen.getByText(/no previous rounds played yet/i)).toBeInTheDocument();
  });

  test('renders empty state when empty array provided', () => {
    render(<ScoreHistory scoreHistory={[]} />);
    expect(screen.getByText(/no previous rounds played yet/i)).toBeInTheDocument();
  });

  test('renders score history table with data', () => {
    const mockHistory = [100, 150, 200];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  test('handles object-based score history', () => {
    const mockHistory = [
      { score: 100, timestamp: '2023-01-01' },
      { score: 150, timestamp: '2023-01-02' }
    ];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    const mockHistory = [100, 150];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Previous round scores');
    
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(2);
    expect(columnHeaders[0]).toHaveTextContent('Round');
    expect(columnHeaders[1]).toHaveTextContent('Score');
  });
});