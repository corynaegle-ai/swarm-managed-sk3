import React from 'react';
import RoundScoreDisplay from './RoundScoreDisplay';

/**
 * ScoreHistory component for displaying historical round scores
 * @param {Object} props - Component props
 * @param {Array} props.scores - Array of score objects with player and round data
 * @param {string} props.currentRound - Current round identifier
 */
const ScoreHistory = ({ scores = [], currentRound }) => {
  if (!scores.length) {
    return (
      <div className="score-history-empty">
        <p>No scores recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="score-history">
      <h3>Round Scores</h3>
      <div className="scores-grid">
        {scores.map((score, index) => (
          <RoundScoreDisplay
            key={`${score.playerName}-${score.round}-${index}`}
            roundScore={score.score}
            playerName={score.playerName}
            isNewScore={score.round === currentRound && score.isNew}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory;