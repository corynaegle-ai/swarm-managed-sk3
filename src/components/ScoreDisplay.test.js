import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreDisplay, { MultiPlayerScoreDisplay } from './ScoreDisplay';

describe('ScoreDisplay', () => {
  it('should display total score with bonus points', () => {
    const player = {
      name: 'Test Player',
      baseScore: 20,
      bid: 5,
      actualScore: 5
    };
    
    render(<ScoreDisplay player={player} />);
    
    expect(screen.getByText('30')).toBeInTheDocument(); // Total score
    expect(screen.getByText('10')).toBeInTheDocument(); // Bonus points
    expect(screen.getByText('(Exact bid match!)')).toBeInTheDocument();
  });
  
  it('should display score without bonus when bid is incorrect', () => {
    const player = {
      name: 'Test Player',
      baseScore: 20,
      bid: 5,
      actualScore: 3
    };
    
    render(<ScoreDisplay player={player} />);
    
    expect(screen.getByText('20')).toBeInTheDocument(); // Total score
    expect(screen.queryByText('(Exact bid match!)')).not.toBeInTheDocument();
  });
});