import React from 'react';
import './RoundScoreDisplay.css';

const RoundScoreDisplay = ({ 
  currentRound = 1, 
  currentScore = 0, 
  totalScore = 0,
  maxRounds = null 
}) => {
  return (
    <div className="round-score-display">
      <div className="round-score-display__container">
        <div className="round-score-display__round">
          <span className="round-score-display__label">Round</span>
          <span className="round-score-display__value">
            {currentRound}{maxRounds && ` / ${maxRounds}`}
          </span>
        </div>
        
        <div className="round-score-display__current-score">
          <span className="round-score-display__label">Current Score</span>
          <span className="round-score-display__value round-score-display__value--highlight">
            {currentScore}
          </span>
        </div>
        
        <div className="round-score-display__total-score">
          <span className="round-score-display__label">Total Score</span>
          <span className="round-score-display__value round-score-display__value--total">
            {totalScore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoundScoreDisplay;