import React, { useState } from 'react';
import './RoundScoringInterface.css';

const RoundScoringInterface = ({ players = [] }) => {
  const [tricksTaken, setTricksTaken] = useState({});
  const [errors, setErrors] = useState({});

  const handleTricksChange = (playerId, value) => {
    // Clear previous error for this player
    setErrors(prev => ({ ...prev, [playerId]: null }));

    // Allow empty string for clearing input
    if (value === '') {
      setTricksTaken(prev => ({ ...prev, [playerId]: '' }));
      return;
    }

    // Validate numeric input
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      setErrors(prev => ({ ...prev, [playerId]: 'Must be a valid number' }));
      return;
    }

    // Validate non-negative
    if (numericValue < 0) {
      setErrors(prev => ({ ...prev, [playerId]: 'Tricks taken must be 0 or greater' }));
      return;
    }

    // Update state with valid value
    setTricksTaken(prev => ({ ...prev, [playerId]: numericValue }));
  };

  return (
    <div className="round-scoring-interface">
      <h3>Round Scoring</h3>
      <div className="scoring-grid">
        {players.map(player => (
          <div key={player.id} className="player-scoring-row">
            <div className="player-name">{player.name}</div>
            <div className="tricks-input-container">
              <label htmlFor={`tricks-${player.id}`} className="tricks-label">
                Tricks Taken:
              </label>
              <input
                id={`tricks-${player.id}`}
                type="number"
                className={`tricks-input ${errors[player.id] ? 'error' : ''}`}
                value={tricksTaken[player.id] || ''}
                onChange={(e) => handleTricksChange(player.id, e.target.value)}
                min="0"
                placeholder="0"
              />
              {errors[player.id] && (
                <div className="error-message">{errors[player.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundScoringInterface;