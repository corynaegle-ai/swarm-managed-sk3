import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidCollection from '../BidCollection';

// Mock GameContext
const mockGameContext = {
  players: [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' }
  ],
  bids: { 1: 5, 2: 3 },
  currentPlayer: { id: 1, name: 'Player 1' },
  gameState: 'bidding',
  onBidUpdate: jest.fn()
};

const GameContext = React.createContext(mockGameContext);

const renderWithContext = (component, contextValue = mockGameContext) => {
  return render(
    <GameContext.Provider value={contextValue}>
      {component}
    </GameContext.Provider>
  );
};

describe('BidCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bid collection component', () => {
    renderWithContext(<BidCollection />);
    expect(screen.getByText('Bid Collection')).toBeInTheDocument();
  });

  test('displays all players with correct bid states', () => {
    renderWithContext(<BidCollection />);
    
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    
    // Check bid values
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('shows correct progress calculation', () => {
    renderWithContext(<BidCollection />);
    expect(screen.getByText('2 / 3 bids collected')).toBeInTheDocument();
  });

  test('displays visual indicators for different bid states', () => {
    renderWithContext(<BidCollection />);
    
    // Should show submitted status for players with bids
    expect(screen.getAllByText('Bid Submitted')).toHaveLength(2);
    expect(screen.getByText('Waiting for Bid')).toBeInTheDocument();
  });

  test('shows notification when all bids are collected', async () => {
    const onAllBidsCollected = jest.fn();
    const allBidsContext = {
      ...mockGameContext,
      bids: { 1: 5, 2: 3, 3: 7 }
    };
    
    renderWithContext(
      <BidCollection onAllBidsCollected={onAllBidsCollected} />, 
      allBidsContext
    );
    
    await waitFor(() => {
      expect(screen.getByText('All bids collected!')).toBeInTheDocument();
    });
    
    expect(onAllBidsCollected).toHaveBeenCalled();
  });

  test('handles invalid bids correctly', () => {
    const invalidBidsContext = {
      ...mockGameContext,
      bids: { 1: -1, 2: 15, 3: 5 }
    };
    
    renderWithContext(<BidCollection />, invalidBidsContext);
    
    expect(screen.getAllByText('Invalid Bid')).toHaveLength(2);
    expect(screen.getByText('Bid Submitted')).toBeInTheDocument();
  });

  test('identifies current player correctly', () => {
    renderWithContext(<BidCollection />);
    expect(screen.getByText('(You)')).toBeInTheDocument();
  });

  test('does not render when game state is not bidding', () => {
    const nonBiddingContext = {
      ...mockGameContext,
      gameState: 'playing'
    };
    
    const { container } = renderWithContext(<BidCollection />, nonBiddingContext);
    expect(container.firstChild).toBeNull();
  });
});