import React from 'react';
import { render, screen, act } from '@testing-library/react';
import RoundScoreDisplay from '../RoundScoreDisplay';

describe('RoundScoreDisplay', () => {
  const defaultProps = {
    roundScore: 85,
    playerName: 'Test Player',
    isNewScore: false
  };

  test('renders score values correctly', () => {
    render(<RoundScoreDisplay {...defaultProps} />);
    
    expect(screen.getByText('Test Player')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  test('displays zero when score is null or undefined', () => {
    render(<RoundScoreDisplay {...defaultProps} roundScore={null} />);
    expect(screen.getByText('0')).toBeInTheDocument();

    render(<RoundScoreDisplay {...defaultProps} roundScore={undefined} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('shows highlight class when isNewScore is true', () => {
    const { container } = render(
      <RoundScoreDisplay {...defaultProps} isNewScore={true} />
    );
    
    const displayElement = container.querySelector('.round-score-display');
    expect(displayElement).toHaveClass('highlight');
  });

  test('has proper ARIA attributes for accessibility', () => {
    render(<RoundScoreDisplay {...defaultProps} />);
    
    const displayElement = screen.getByLabelText('Test Player round score: 85');
    expect(displayElement).toHaveAttribute('aria-live', 'polite');
  });

  test('removes highlight class after timeout', async () => {
    jest.useFakeTimers();
    
    const { container } = render(
      <RoundScoreDisplay {...defaultProps} isNewScore={true} />
    );
    
    const displayElement = container.querySelector('.round-score-display');
    expect(displayElement).toHaveClass('highlight');
    
    act(() => {
      jest.advanceTimersByTime(700);
    });
    
    expect(displayElement).not.toHaveClass('highlight');
    
    jest.useRealTimers();
  });
});