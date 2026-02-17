import React from 'react';
import './RoundScoreDisplay.css';

const RoundScoreDisplay = ({ currentRound, currentScore, isRoundActive = false }) => {
  return (
    <div className={`round-score-display ${isRoundActive ? 'round-score-display--active' : ''}`}>
      <div className="round-score-display__content">
        <div className="round-score-display__round">
          <span className="round-score-display__label">Current Round</span>
          <span className="round-score-display__value">{currentRound || 1}</span>
        </div>
        <div className="round-score-display__score">
          <span className="round-score-display__label">Score</span>
          <span className="round-score-display__value">{currentScore || 0}</span>
        </div>
      </div>
      {isRoundActive && (
        <div className="round-score-display__indicator">
          <span className="round-score-display__pulse"></span>
          <span className="round-score-display__text">Round in Progress</span>
        </div>
      )}
    </div>
  );
};

export default RoundScoreDisplay;