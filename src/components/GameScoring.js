import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BonusPointsEntry from './BonusPointsEntry';

const GameScoring = ({ gameId, players: initialPlayers, onScoreUpdate }) => {
  const [players, setPlayers] = useState(initialPlayers || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialPlayers) {
      setPlayers(initialPlayers);
    }
  }, [initialPlayers]);

  const handleBonusPointsUpdate = (playerId, bonusPoints) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === playerId 
          ? { ...player, bonus_points: bonusPoints }
          : player
      )
    );

    if (onScoreUpdate) {
      onScoreUpdate(playerId, { bonus_points: bonusPoints });
    }
  };

  const calculateTotalScore = (player) => {
    const baseScore = player.score || 0;
    const bonusScore = player.bonus_points || 0;
    return baseScore + bonusScore;
  };

  if (isLoading) {
    return <div className="loading">Loading game scoring...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <span>Error loading game scoring: {error}</span>
      </div>
    );
  }

  return (
    <div className="game-scoring">
      <h2>Game Scoring</h2>
      
      <div className="current-scores">
        <h3>Current Scores</h3>
        <div className="scores-table">
          <div className="scores-header">
            <div>Player</div>
            <div>Base Score</div>
            <div>Bonus Points</div>
            <div>Total Score</div>
            <div>Bid Status</div>
          </div>
          {players.map(player => (
            <div key={player.id} className="score-row">
              <div className="player-name">{player.name}</div>
              <div className="base-score">{player.score || 0}</div>
              <div className="bonus-score">{player.bonus_points || 0}</div>
              <div className="total-score">{calculateTotalScore(player)}</div>
              <div className={`bid-status ${player.bid_correct ? 'correct' : 'incorrect'}`}>
                {player.bid_correct ? '✓ Correct' : '✗ Incorrect'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BonusPointsEntry 
        players={players}
        gameId={gameId}
        onBonusPointsUpdate={handleBonusPointsUpdate}
      />

      <style jsx>{`
        .game-scoring {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .current-scores {
          margin-bottom: 30px;
        }

        .scores-table {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .scores-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          background: #f8f9fa;
          font-weight: bold;
          padding: 12px;
          border-bottom: 2px solid #ddd;
        }

        .score-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          padding: 12px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }

        .score-row:nth-child(even) {
          background: #f8f9fa;
        }

        .player-name {
          font-weight: 500;
        }

        .base-score, .bonus-score, .total-score {
          text-align: center;
          font-family: monospace;
        }

        .total-score {
          font-weight: bold;
        }

        .bid-status {
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .bid-status.correct {
          background: #d4edda;
          color: #155724;
        }

        .bid-status.incorrect {
          background: #f8d7da;
          color: #721c24;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
        }

        h2, h3 {
          color: #333;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

GameScoring.propTypes = {
  gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      score: PropTypes.number,
      bonus_points: PropTypes.number,
      bid_correct: PropTypes.bool.isRequired
    })
  ),
  onScoreUpdate: PropTypes.func
};

GameScoring.defaultProps = {
  players: [],
  onScoreUpdate: null
};

export default GameScoring;