import React, { useState, useEffect } from 'react';
import RoundScoreDisplay from './RoundScoreDisplay';
import ScoreHistory from './ScoreHistory';
import './ScoreBoard.css';

const ScoreBoard = ({ gameState, players = [] }) => {
  const [scoreHistory, setScoreHistory] = useState([]);
  const [highlightedChanges, setHighlightedChanges] = useState(false);
  const [previousTotals, setPreviousTotals] = useState({});

  // Calculate running totals for each player
  const calculateRunningTotals = () => {
    const totals = {};
    players.forEach(player => {
      totals[player.id] = scoreHistory.reduce((sum, round) => {
        return sum + (round.scores[player.id] || 0);
      }, 0);
    });
    return totals;
  };

  const runningTotals = calculateRunningTotals();

  // Update scores function - adds new round scores to history
  const updateScores = (newRoundScores) => {
    const newRound = {
      round: scoreHistory.length + 1,
      scores: newRoundScores,
      timestamp: new Date().toISOString()
    };

    setScoreHistory(prev => [...prev, newRound]);
    
    // Trigger highlighting animation for changed scores
    setHighlightedChanges(true);
    setTimeout(() => setHighlightedChanges(false), 2000);
  };

  // Detect score changes for highlighting
  useEffect(() => {
    const hasChanges = players.some(player => 
      previousTotals[player.id] !== runningTotals[player.id]
    );
    
    if (hasChanges && Object.keys(previousTotals).length > 0) {
      setHighlightedChanges(true);
      setTimeout(() => setHighlightedChanges(false), 2000);
    }
    
    setPreviousTotals(runningTotals);
  }, [runningTotals]);

  // Get current round scores (latest round from history)
  const getCurrentRoundScores = () => {
    if (scoreHistory.length === 0) return {};
    return scoreHistory[scoreHistory.length - 1].scores;
  };

  const currentRoundScores = getCurrentRoundScores();

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h2>Score Board</h2>
        <div className="round-indicator">
          Round {scoreHistory.length}
        </div>
      </div>

      <div className="scores-section">
        <div className="running-totals">
          <h3>Running Totals</h3>
          <div className="totals-grid">
            {players.map(player => (
              <div 
                key={player.id} 
                className={`total-item ${highlightedChanges ? 'highlighted' : ''}`}
              >
                <span className="player-name">{player.name}</span>
                <span className="total-score">{runningTotals[player.id] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="round-scores">
          <h3>Current Round Scores</h3>
          <div className="round-scores-grid">
            {players.map(player => (
              <RoundScoreDisplay
                key={player.id}
                playerId={player.id}
                playerName={player.name}
                score={currentRoundScores[player.id] || 0}
                highlighted={highlightedChanges}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="history-section">
        <ScoreHistory 
          history={scoreHistory}
          players={players}
        />
      </div>

      {/* Debug/Admin section for testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <button 
            onClick={() => {
              const mockScores = {};
              players.forEach(player => {
                mockScores[player.id] = Math.floor(Math.random() * 100);
              });
              updateScores(mockScores);
            }}
          >
            Add Test Scores
          </button>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;