import React from 'react';
import { calculateTotalScore } from '../utils/scoring';

/**
 * Component to display player scores with bonus points breakdown
 * @param {Object} props - Component props
 * @param {Object} props.player - Player object with score data
 * @param {boolean} props.showBreakdown - Whether to show detailed breakdown
 * @returns {JSX.Element} Score display component
 */
const ScoreDisplay = ({ player, showBreakdown = true }) => {
  if (!player) {
    return (
      <div className="score-display error">
        <span>No player data available</span>
      </div>
    );
  }
  
  const scoreData = calculateTotalScore(player);
  const { baseScore, bonusPoints, totalScore } = scoreData;
  
  return (
    <div className="score-display">
      <div className="player-name">
        <h3>{player.name || 'Unknown Player'}</h3>
      </div>
      
      <div className="score-summary">
        <div className="total-score">
          <span className="label">Total Score:</span>
          <span className="value">{totalScore}</span>
        </div>
      </div>
      
      {showBreakdown && (
        <div className="score-breakdown">
          <div className="base-score">
            <span className="label">Base Score:</span>
            <span className="value">{baseScore}</span>
          </div>
          
          <div className={`bonus-points ${bonusPoints > 0 ? 'has-bonus' : ''}`}>
            <span className="label">Bonus Points:</span>
            <span className="value">{bonusPoints}</span>
            {bonusPoints > 0 && (
              <span className="bonus-reason">(Exact bid match!)</span>
            )}
          </div>
          
          {player.bid !== undefined && player.actualScore !== undefined && (
            <div className="bid-info">
              <span className="label">Bid: {player.bid} | Actual: {player.actualScore}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Component to display scores for multiple players
 * @param {Object} props - Component props
 * @param {Array} props.players - Array of player objects
 * @param {boolean} props.showBreakdown - Whether to show detailed breakdown
 * @returns {JSX.Element} Multiple player score display
 */
export const MultiPlayerScoreDisplay = ({ players, showBreakdown = true }) => {
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <div className="multi-score-display empty">
        <p>No players to display</p>
      </div>
    );
  }
  
  return (
    <div className="multi-score-display">
      {players.map((player, index) => (
        <ScoreDisplay 
          key={player.id || index}
          player={player}
          showBreakdown={showBreakdown}
        />
      ))}
    </div>
  );
};

export default ScoreDisplay;