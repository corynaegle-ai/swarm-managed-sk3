import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreHistory from './ScoreHistory';

describe('ScoreHistory', () => {
  test('renders empty state when no history provided', () => {
    render(<ScoreHistory />);
    expect(screen.getByText(/no previous rounds yet/i)).toBeInTheDocument();
  });

  test('renders empty state when empty array provided', () => {
    render(<ScoreHistory scoreHistory={[]} />);
    expect(screen.getByText(/no previous rounds yet/i)).toBeInTheDocument();
  });

  test('renders score history table with data', () => {
    const mockHistory = [100, 250, 150];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    expect(screen.getByText('Score History')).toBeInTheDocument();
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Round 3')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('has proper semantic HTML structure', () => {
    const mockHistory = [100, 250];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(2);
    expect(columnHeaders[0]).toHaveTextContent('Round');
    expect(columnHeaders[1]).toHaveTextContent('Score');
  });

  test('renders correct number of rows for score history', () => {
    const mockHistory = [100, 250, 150, 300];
    render(<ScoreHistory scoreHistory={mockHistory} />);
    
    const rows = screen.getAllByRole('row');
    // Header row + 4 data rows
    expect(rows).toHaveLength(5);
  });
});