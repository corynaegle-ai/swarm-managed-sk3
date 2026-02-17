import React, { useEffect, useState } from 'react';
import './RoundScoreDisplay.css';

/**
 * RoundScoreDisplay component for showing round scores with visual feedback
 * @param {Object} props - Component props
 * @param {number} props.roundScore - The score for the current round
 * @param {string} props.playerName - Name of the player
 * @param {boolean} props.isNewScore - Whether this is a new score (triggers highlight)
 */
const RoundScoreDisplay = ({ roundScore, playerName, isNewScore = false }) => {
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (isNewScore) {
      setShowHighlight(true);
      // Remove highlight after animation duration
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 600); // Slightly longer than CSS animation

      return () => clearTimeout(timer);
    }
  }, [isNewScore, roundScore]);

  const displayScore = roundScore !== null && roundScore !== undefined ? roundScore : 0;

  return (
    <div 
      className={`round-score-display ${showHighlight ? 'highlight' : ''}`}
      aria-live="polite"
      aria-label={`${playerName} round score: ${displayScore}`}
    >
      <div className="player-name">{playerName}</div>
      <div className="score-value">
        {displayScore}
      </div>
    </div>
  );
};

export default RoundScoreDisplay;