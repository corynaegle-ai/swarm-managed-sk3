import React from 'react';
import './RoundScoreDisplay.css';

const RoundScoreDisplay = ({ 
  currentRound = 1, 
  currentScore = 0, 
  maxScore = null 
}) => {
  return (
    <div className="round-score-display">
      <div className="round-score-display__content">
        <div className="round-score-display__round">
          <span className="round-score-display__label">Round</span>
          <span className="round-score-display__value">{currentRound}</span>
        </div>
        
        <div className="round-score-display__score">
          <span className="round-score-display__label">Current Score</span>
          <span className="round-score-display__value">
            {currentScore}
            {maxScore && (
              <span className="round-score-display__max"> / {maxScore}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoundScoreDisplay;