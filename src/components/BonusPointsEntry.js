import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BonusPointsEntry = ({ players, gameId, onBonusPointsUpdate }) => {
  const [bonusPoints, setBonusPoints] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter players who are eligible for bonus points (bid_correct === true)
  const eligiblePlayers = players.filter(player => player.bid_correct === true);

  // Initialize bonus points state with defaults of 0
  useEffect(() => {
    const initialBonusPoints = {};
    eligiblePlayers.forEach(player => {
      initialBonusPoints[player.id] = player.bonus_points || 0;
    });
    setBonusPoints(initialBonusPoints);
  }, [eligiblePlayers]);

  const handleBonusPointsChange = (playerId, value) => {
    const numValue = parseInt(value, 10) || 0;
    setBonusPoints(prev => ({
      ...prev,
      [playerId]: numValue
    }));
  };

  const handleSubmit = async (playerId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/games/${gameId}/players/${playerId}/bonus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bonus_points: bonusPoints[playerId]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update bonus points: ${response.statusText}`);
      }

      const updatedPlayer = await response.json();
      
      if (onBonusPointsUpdate) {
        onBonusPointsUpdate(playerId, bonusPoints[playerId]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating bonus points:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (eligiblePlayers.length === 0) {
    return (
      <div className="bonus-points-entry">
        <h3>Bonus Points</h3>
        <p className="no-eligible-players">No players are eligible for bonus points this round.</p>
      </div>
    );
  }

  return (
    <div className="bonus-points-entry">
      <h3>Bonus Points Entry</h3>
      <p className="eligibility-note">✓ Only players who got their bid exactly correct are eligible for bonus points</p>
      
      {error && (
        <div className="error-message">
          <span>Error: {error}</span>
        </div>
      )}

      <div className="eligible-players">
        {eligiblePlayers.map(player => (
          <div key={player.id} className="player-bonus-entry">
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="eligibility-indicator">✓ Eligible</span>
            </div>
            <div className="bonus-input-group">
              <label htmlFor={`bonus-${player.id}`}>Bonus Points:</label>
              <input
                id={`bonus-${player.id}`}
                type="number"
                min="0"
                max="100"
                value={bonusPoints[player.id] || 0}
                onChange={(e) => handleBonusPointsChange(player.id, e.target.value)}
                disabled={isLoading}
                className="bonus-input"
              />
              <button
                onClick={() => handleSubmit(player.id)}
                disabled={isLoading}
                className="update-bonus-btn"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .bonus-points-entry {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .eligibility-note {
          font-style: italic;
          color: #666;
          margin-bottom: 15px;
        }

        .no-eligible-players {
          color: #888;
          font-style: italic;
        }

        .player-bonus-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin: 10px 0;
          background: white;
          border-radius: 5px;
          border: 1px solid #eee;
        }

        .player-info {
          display: flex;
          flex-direction: column;
        }

        .player-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .eligibility-indicator {
          color: #28a745;
          font-size: 0.9em;
        }

        .bonus-input-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bonus-input {
          width: 80px;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }

        .update-bonus-btn {
          padding: 5px 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }

        .update-bonus-btn:hover {
          background: #0056b3;
        }

        .update-bonus-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

BonusPointsEntry.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      bid_correct: PropTypes.bool.isRequired,
      bonus_points: PropTypes.number
    })
  ).isRequired,
  gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBonusPointsUpdate: PropTypes.func
};

BonusPointsEntry.defaultProps = {
  onBonusPointsUpdate: null
};

export default BonusPointsEntry;