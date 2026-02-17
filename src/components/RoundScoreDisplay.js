import React from 'react';
import './RoundScoreDisplay.css';

const RoundScoreDisplay = ({ playerId, playerName, score, highlighted = false }) => {
  return (
    <div className={`round-score-display ${highlighted ? 'highlighted' : ''}`}>
      <div className="player-info">
        <span className="player-name">{playerName}</span>
      </div>
      <div className="score-value">
        <span className="score-number">{score}</span>
      </div>
      <div className="score-indicator">
        {score > 0 && <span className="positive-indicator">+{score}</span>}
        {score < 0 && <span className="negative-indicator">{score}</span>}
        {score === 0 && <span className="neutral-indicator">0</span>}
      </div>
    </div>
  );
};

export default RoundScoreDisplay;