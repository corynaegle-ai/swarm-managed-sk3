import React from 'react';
import './RoundScoreDisplay.css';

const RoundScoreDisplay = ({ playerId, playerName, score, highlighted }) => {
  return (
    <div className={`round-score-display ${highlighted ? 'highlighted' : ''}`}>
      <div className="player-info">
        <span className="player-name">{playerName}</span>
      </div>
      <div className="score-value">
        <span className={`score ${highlighted ? 'score-highlighted' : ''}`}>
          {score || 0}
        </span>
      </div>
    </div>
  );
};

export default RoundScoreDisplay;