import React, { useState } from 'react';
import './ScoreHistory.css';

const ScoreHistory = ({ history = [], players = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return (
      <div className="score-history empty">
        <div className="history-header">
          <h3>Score History</h3>
        </div>
        <p className="no-history">No rounds played yet</p>
      </div>
    );
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayHistory = isExpanded ? history : history.slice(-3);

  return (
    <div className="score-history">
      <div className="history-header">
        <h3>Score History</h3>
        {history.length > 3 && (
          <button 
            className="toggle-history-btn"
            onClick={toggleExpanded}
          >
            {isExpanded ? 'Show Less' : `Show All (${history.length} rounds)`}
          </button>
        )}
      </div>

      <div className="history-list">
        {displayHistory.map((round, index) => (
          <div key={index} className="history-round">
            <div className="round-header">
              <span className="round-number">Round {round.round}</span>
              <span className="round-timestamp">
                {new Date(round.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="round-scores">
              {players.map(player => (
                <div key={player.id} className="player-round-score">
                  <span className="player-name">{player.name}</span>
                  <span className="player-score">
                    {round.scores[player.id] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && history.length > 3 && (
        <div className="history-summary">
          <p>Showing last 3 rounds of {history.length} total</p>
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;