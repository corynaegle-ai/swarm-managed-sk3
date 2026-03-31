import React from 'react';
import './ScoreBoard.css';

const ScoreHistory = ({ history, players }) => {
  if (!history || history.length === 0) {
    return (
      <div className="score-history">
        <h3>Score History</h3>
        <p className="no-history">No rounds played yet</p>
      </div>
    );
  }

  return (
    <div className="score-history">
      <h3>Score History</h3>
      <div className="history-container">
        <div className="history-header">
          <span className="round-header">Round</span>
          {players.map(player => (
            <span key={player.id} className="player-header">
              {player.name}
            </span>
          ))}
        </div>
        <div className="history-rows">
          {history.map((round, index) => (
            <div key={index} className="history-row">
              <span className="round-number">{round.round}</span>
              {players.map(player => (
                <span key={player.id} className="score-cell">
                  {round.scores[player.id] || 0}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory;