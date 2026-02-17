import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoundScoringInterface from '../RoundScoringInterface';

const mockPlayers = [
  { id: 1, name: 'Player 1' },
  { id: 2, name: 'Player 2' },
  { id: 3, name: 'Player 3' }
];

describe('RoundScoringInterface', () => {
  test('renders all players with input fields', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(3);
  });

  test('input fields are controlled components', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    const input = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-1' });
    expect(input.value).toBe('');
    
    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toBe('5');
  });

  test('validates numeric input only', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    const input = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-1' });
    
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByText('Must be a valid number')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  test('validates tricks taken >= 0', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    const input = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-1' });
    
    fireEvent.change(input, { target: { value: '-1' } });
    expect(screen.getByText('Tricks taken must be 0 or greater')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  test('accepts valid numeric input', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    const input = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-1' });
    
    fireEvent.change(input, { target: { value: '3' } });
    expect(input.value).toBe('3');
    expect(screen.queryByText('Must be a valid number')).not.toBeInTheDocument();
    expect(screen.queryByText('Tricks taken must be 0 or greater')).not.toBeInTheDocument();
  });

  test('displays error messages for invalid inputs', () => {
    render(<RoundScoringInterface players={mockPlayers} />);
    
    const input1 = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-1' });
    const input2 = screen.getByLabelText('Tricks Taken:', { selector: '#tricks-2' });
    
    fireEvent.change(input1, { target: { value: 'invalid' } });
    fireEvent.change(input2, { target: { value: '-5' } });
    
    expect(screen.getByText('Must be a valid number')).toBeInTheDocument();
    expect(screen.getByText('Tricks taken must be 0 or greater')).toBeInTheDocument();
  });
});