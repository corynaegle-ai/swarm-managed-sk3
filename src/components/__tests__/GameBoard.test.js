import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

describe('GameBoard Round Advancement', () => {
  test('automatically advances to next round after score submission', () => {
    render(<GameBoard players={mockPlayers} maxRounds={3} />);
    
    // Should start at round 1
    expect(screen.getByText(/Round: 1\/3/)).toBeInTheDocument();
    expect(screen.getByText(/Phase: bidding/)).toBeInTheDocument();
    
    // Enter bids
    const bidInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(bidInputs[0], { target: { value: '2' } });
    fireEvent.change(bidInputs[1], { target: { value: '3' } });
    
    // Should advance to playing phase
    expect(screen.getByText(/Phase: playing/)).toBeInTheDocument();
    
    // Enter tricks
    const trickInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(trickInputs[0], { target: { value: '2' } });
    fireEvent.change(trickInputs[1], { target: { value: '2' } });
    
    // Should advance to scoring phase
    expect(screen.getByText(/Phase: scoring/)).toBeInTheDocument();
    
    // Click next round button
    const nextRoundBtn = screen.getByText('Next Round');
    fireEvent.click(nextRoundBtn);
    
    // Should advance to round 2 with bidding phase
    expect(screen.getByText(/Round: 2\/3/)).toBeInTheDocument();
    expect(screen.getByText(/Phase: bidding/)).toBeInTheDocument();
  });
  
  test('preserves round history when advancing rounds', () => {
    render(<GameBoard players={mockPlayers} maxRounds={2} />);
    
    // Complete first round
    const bidInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(bidInputs[0], { target: { value: '1' } });
    fireEvent.change(bidInputs[1], { target: { value: '1' } });
    
    const trickInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(trickInputs[0], { target: { value: '1' } });
    fireEvent.change(trickInputs[1], { target: { value: '0' } });
    
    const nextRoundBtn = screen.getByText('Next Round');
    fireEvent.click(nextRoundBtn);
    
    // Should show round history
    expect(screen.getByText('Round History')).toBeInTheDocument();
    expect(screen.getByText(/Round 1:/)).toBeInTheDocument();
  });
  
  test('ends game when maximum rounds reached', () => {
    render(<GameBoard players={mockPlayers} maxRounds={1} />);
    
    // Complete the single round
    const bidInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(bidInputs[0], { target: { value: '2' } });
    fireEvent.change(bidInputs[1], { target: { value: '1' } });
    
    const trickInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(trickInputs[0], { target: { value: '2' } });
    fireEvent.change(trickInputs[1], { target: { value: '1' } });
    
    const finishBtn = screen.getByText('Finish Game');
    fireEvent.click(finishBtn);
    
    // Should show game complete screen
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    expect(screen.getByText(/Winner:/)).toBeInTheDocument();
  });
});