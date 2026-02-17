import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerSetup from './PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders player setup form', () => {
    render(<PlayerSetup />);
    
    expect(screen.getByText('Player Setup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter player name')).toBeInTheDocument();
    expect(screen.getByText('Add Player')).toBeInTheDocument();
  });

  test('can add players with required names up to 8 maximum', () => {
    render(<PlayerSetup />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add first player
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Players (1/8)')).toBeInTheDocument();

    // Add second player
    fireEvent.change(input, { target: { value: 'Player 2' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Players (2/8)')).toBeInTheDocument();
  });

  test('prevents adding empty names', () => {
    render(<PlayerSetup />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Try to add empty name
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Player name is required')).toBeInTheDocument();
  });

  test('can edit existing player names inline', async () => {
    render(<PlayerSetup />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add a player
    fireEvent.change(input, { target: { value: 'Original Name' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Original Name')).toBeInTheDocument();

    // Click edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Edit the name
    const editInput = screen.getByDisplayValue('Original Name');
    fireEvent.change(editInput, { target: { value: 'New Name' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('New Name')).toBeInTheDocument();
      expect(screen.queryByText('Original Name')).not.toBeInTheDocument();
    });
  });

  test('shows validation error when trying to start with fewer than 2 players', () => {
    render(<PlayerSetup />);
    
    const startButton = screen.getByText('Start Game');
    
    // Try to start with no players
    fireEvent.click(startButton);
    expect(screen.getByText('At least 2 players required to start the game')).toBeInTheDocument();

    // Add one player
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);

    // Try to start with 1 player
    fireEvent.click(startButton);
    expect(screen.getByText('At least 2 players required to start the game')).toBeInTheDocument();
  });

  test('player list displays all added players with names', () => {
    render(<PlayerSetup />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add multiple players
    const playerNames = ['Alice', 'Bob', 'Charlie'];
    
    playerNames.forEach(name => {
      fireEvent.change(input, { target: { value: name } });
      fireEvent.click(addButton);
    });

    // Check all players are displayed
    playerNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Players (3/8)')).toBeInTheDocument();
  });

  test('prevents adding more than 8 players', () => {
    render(<PlayerSetup />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add 8 players
    for (let i = 1; i <= 8; i++) {
      fireEvent.change(input, { target: { value: `Player ${i}` } });
      fireEvent.click(addButton);
    }

    expect(screen.getByText('Players (8/8)')).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    // Try to add 9th player
    fireEvent.change(input, { target: { value: 'Player 9' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Maximum 8 players allowed')).toBeInTheDocument();
    expect(screen.queryByText('Player 9')).not.toBeInTheDocument();
  });
});