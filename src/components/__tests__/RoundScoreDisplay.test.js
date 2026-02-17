import React from 'react';
import { render, screen } from '@testing-library/react';
import RoundScoreDisplay from '../RoundScoreDisplay';

describe('RoundScoreDisplay', () => {
  const defaultProps = {
    playerId: 'player1',
    playerName: 'Alice',
    score: 85,
    highlighted: false
  };

  it('renders player name and score', () => {
    render(<RoundScoreDisplay {...defaultProps} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('applies highlighted class when highlighted prop is true', () => {
    render(<RoundScoreDisplay {...defaultProps} highlighted={true} />);
    
    const container = screen.getByText('Alice').closest('.round-score-display');
    expect(container).toHaveClass('highlighted');
  });

  it('handles zero score', () => {
    render(<RoundScoreDisplay {...defaultProps} score={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles undefined score', () => {
    render(<RoundScoreDisplay {...defaultProps} score={undefined} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});