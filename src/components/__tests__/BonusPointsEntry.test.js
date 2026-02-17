import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BonusPointsEntry from '../BonusPointsEntry';

// Mock fetch
global.fetch = jest.fn();

const mockPlayers = [
  { id: 1, name: 'Player 1', bid_correct: true, bonus_points: 0 },
  { id: 2, name: 'Player 2', bid_correct: false, bonus_points: 0 },
  { id: 3, name: 'Player 3', bid_correct: true, bonus_points: 5 }
];

describe('BonusPointsEntry', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('only shows input fields for eligible players', () => {
    render(<BonusPointsEntry players={mockPlayers} gameId={1} />);
    
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    expect(screen.queryByText('Player 2')).not.toBeInTheDocument();
  });

  it('shows visual indication of eligibility', () => {
    render(<BonusPointsEntry players={mockPlayers} gameId={1} />);
    
    const eligibilityIndicators = screen.getAllByText('✓ Eligible');
    expect(eligibilityIndicators).toHaveLength(2);
  });

  it('defaults bonus points to 0 for new players', () => {
    const playersWithoutBonus = [
      { id: 1, name: 'Player 1', bid_correct: true }
    ];
    
    render(<BonusPointsEntry players={playersWithoutBonus} gameId={1} />);
    
    const input = screen.getByDisplayValue('0');
    expect(input).toBeInTheDocument();
  });

  it('makes API call when updating bonus points', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, bonus_points: 10 })
    });

    const mockCallback = jest.fn();
    render(
      <BonusPointsEntry 
        players={mockPlayers} 
        gameId={1} 
        onBonusPointsUpdate={mockCallback}
      />
    );
    
    const input = screen.getAllByRole('spinbutton')[0];
    const updateButton = screen.getAllByText('Update')[0];
    
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/games/1/players/1/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bonus_points: 10 })
      });
    });

    expect(mockCallback).toHaveBeenCalledWith(1, 10);
  });

  it('shows message when no players are eligible', () => {
    const ineligiblePlayers = [
      { id: 1, name: 'Player 1', bid_correct: false }
    ];
    
    render(<BonusPointsEntry players={ineligiblePlayers} gameId={1} />);
    
    expect(screen.getByText('No players are eligible for bonus points this round.')).toBeInTheDocument();
  });
});