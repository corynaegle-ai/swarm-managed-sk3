import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scoreboard from '../Scoreboard';

// Mock WebSocket
class MockWebSocket {
  constructor() {
    this.readyState = WebSocket.OPEN;
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 10);
  }
  
  close() {
    this.readyState = WebSocket.CLOSED;
  }
  
  send() {}
}

global.WebSocket = MockWebSocket;

// Mock fetch
global.fetch = jest.fn();

const mockPlayersData = {
  players: [
    {
      id: 1,
      name: 'Player 1',
      scores: [85, 92, 78, 88, 0, 0, 0, 0, 0, 0],
      total: 343
    },
    {
      id: 2,
      name: 'Player 2',
      scores: [78, 85, 90, 82, 0, 0, 0, 0, 0, 0],
      total: 335
    }
  ]
};

describe('Scoreboard Component', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPlayersData
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders scoreboard with players and scores', async () => {
    render(<Scoreboard gameId="test-game" currentRound={3} />);
    
    await waitFor(() => {
      expect(screen.getByText('Game Scoreboard')).toBeInTheDocument();
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getByText('Player 2')).toBeInTheDocument();
    });
  });

  test('highlights current round column', async () => {
    render(<Scoreboard gameId="test-game" currentRound={3} />);
    
    await waitFor(() => {
      const currentRoundHeader = screen.getByText('R3').closest('th');
      expect(currentRoundHeader).toHaveClass('current-round');
    });
  });

  test('shows running totals', async () => {
    render(<Scoreboard gameId="test-game" currentRound={4} />);
    
    await waitFor(() => {
      expect(screen.getByText('343')).toBeInTheDocument();
      expect(screen.getByText('335')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Scoreboard gameId="test-game" />);
    
    expect(screen.getByText('Loading scoreboard...')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    fetch.mockRejectedValue(new Error('Network error'));
    
    render(<Scoreboard gameId="test-game" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load player data')).toBeInTheDocument();
    });
  });

  test('shows retry button on error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<Scoreboard gameId="test-game" />);
    
    await waitFor(() => {
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });
  });

  test('displays current round indicator', async () => {
    render(<Scoreboard gameId="test-game" currentRound={5} />);
    
    await waitFor(() => {
      expect(screen.getByText('Current Round:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  test('shows connection status', async () => {
    render(<Scoreboard gameId="test-game" />);
    
    await waitFor(() => {
      expect(screen.getByText('🟢 Live Updates Active')).toBeInTheDocument();
    });
  });
});