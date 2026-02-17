import React from 'react';
import { render, screen } from '@testing-library/react';
import RoundScoreDisplay from '../RoundScoreDisplay';

describe('RoundScoreDisplay', () => {
  test('renders player name and score', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Test Player" 
        score={25} 
      />
    );
    
    expect(screen.getByText('Test Player')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('+25')).toBeInTheDocument();
  });

  test('displays positive score indicator', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Player" 
        score={50} 
      />
    );
    
    expect(screen.getByText('+50')).toBeInTheDocument();
    expect(screen.getByText('+50')).toHaveClass('positive-indicator');
  });

  test('displays negative score indicator', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Player" 
        score={-25} 
      />
    );
    
    expect(screen.getByText('-25')).toBeInTheDocument();
    expect(screen.getByText('-25')).toHaveClass('negative-indicator');
  });

  test('displays neutral score indicator for zero', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Player" 
        score={0} 
      />
    );
    
    expect(screen.getByText('0')).toBeInTheDocument();
    const neutralIndicator = screen.getAllByText('0').find(el => 
      el.classList.contains('neutral-indicator')
    );
    expect(neutralIndicator).toBeInTheDocument();
  });

  test('applies highlighted class when highlighted prop is true', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Player" 
        score={25} 
        highlighted={true}
      />
    );
    
    const container = screen.getByText('Player').closest('.round-score-display');
    expect(container).toHaveClass('highlighted');
  });

  test('does not apply highlighted class by default', () => {
    render(
      <RoundScoreDisplay 
        playerId="1" 
        playerName="Player" 
        score={25} 
      />
    );
    
    const container = screen.getByText('Player').closest('.round-score-display');
    expect(container).not.toHaveClass('highlighted');
  });
});