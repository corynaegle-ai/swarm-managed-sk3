import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from '../GameBoard';

describe('GameBoard Component', () => {
  test('renders with initial bidding phase', () => {
    render(<GameBoard />);
    expect(screen.getByText('Bidding Phase')).toBeInTheDocument();
    expect(screen.getByText('Current Phase: bidding')).toBeInTheDocument();
  });

  test('transitions to scoring phase when all bids are placed', async () => {
    render(<GameBoard />);
    
    // Place bids for all players
    const bidInputs = screen.getAllByPlaceholderText('Enter bid');
    fireEvent.change(bidInputs[0], { target: { value: '3' } });
    fireEvent.change(bidInputs[1], { target: { value: '4' } });
    fireEvent.change(bidInputs[2], { target: { value: '2' } });
    fireEvent.change(bidInputs[3], { target: { value: '5' } });
    
    // Wait for phase transition
    await waitFor(() => {
      expect(screen.getByText('Scoring Phase')).toBeInTheDocument();
      expect(screen.getByText('Current Phase: scoring')).toBeInTheDocument();
    });
  });

  test('shows scoring interface in scoring phase', async () => {
    render(<GameBoard />);
    
    // Place all bids to trigger transition
    const bidInputs = screen.getAllByPlaceholderText('Enter bid');
    bidInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Scoring Phase')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('Enter score')).toHaveLength(4);
      expect(screen.getByText('Complete Round')).toBeInTheDocument();
    });
  });

  test('displays player bids in scoring phase', async () => {
    render(<GameBoard />);
    
    // Place specific bids
    const bidInputs = screen.getAllByPlaceholderText('Enter bid');
    fireEvent.change(bidInputs[0], { target: { value: '3' } });
    fireEvent.change(bidInputs[1], { target: { value: '4' } });
    fireEvent.change(bidInputs[2], { target: { value: '2' } });
    fireEvent.change(bidInputs[3], { target: { value: '5' } });
    
    await waitFor(() => {
      expect(screen.getByText('Bid: 3')).toBeInTheDocument();
      expect(screen.getByText('Bid: 4')).toBeInTheDocument();
      expect(screen.getByText('Bid: 2')).toBeInTheDocument();
      expect(screen.getByText('Bid: 5')).toBeInTheDocument();
    });
  });
});