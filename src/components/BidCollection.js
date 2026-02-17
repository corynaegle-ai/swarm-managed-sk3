import React, { useState, useEffect, useContext } from 'react';
import './BidCollection.css';

// Mock GameContext - replace with actual game state management
const GameContext = React.createContext({
  players: [],
  bids: {},
  currentPlayer: null,
  gameState: 'bidding',
  onBidUpdate: () => {}
});

const BidCollection = ({ onAllBidsCollected }) => {
  const { players, bids, currentPlayer, gameState, onBidUpdate } = useContext(GameContext);
  const [localBids, setLocalBids] = useState({});
  const [bidStates, setBidStates] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  // Listen for real-time bid updates
  useEffect(() => {
    if (bids) {
      setLocalBids(prev => ({ ...prev, ...bids }));
      
      // Update bid states based on validation
      const newBidStates = {};
      players.forEach(player => {
        const bid = bids[player.id];
        if (bid === undefined) {
          newBidStates[player.id] = 'pending';
        } else if (bid < 0 || bid > 13) {
          newBidStates[player.id] = 'invalid';
        } else {
          newBidStates[player.id] = 'submitted';
        }
      });
      setBidStates(newBidStates);
      
      // Check if all bids are collected
      const allSubmitted = players.every(player => 
        newBidStates[player.id] === 'submitted'
      );
      
      if (allSubmitted && players.length > 0) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        onAllBidsCollected && onAllBidsCollected();
      }
    }
  }, [bids, players, onAllBidsCollected]);

  const calculateProgress = () => {
    if (!players.length) return 0;
    const submittedCount = Object.values(bidStates).filter(state => state === 'submitted').length;
    return (submittedCount / players.length) * 100;
  };

  const getBidStatusIcon = (state) => {
    switch (state) {
      case 'submitted': return '✓';
      case 'pending': return '○';
      case 'invalid': return '✗';
      case 'warning': return '⚠';
      default: return '○';
    }
  };

  const getBidStatusText = (state) => {
    switch (state) {
      case 'submitted': return 'Bid Submitted';
      case 'pending': return 'Waiting for Bid';
      case 'invalid': return 'Invalid Bid';
      case 'warning': return 'Bid Warning';
      default: return 'Pending';
    }
  };

  if (gameState !== 'bidding') {
    return null;
  }

  return (
    <div className="bid-collection">
      <div className="bid-collection-header">
        <h3>Bid Collection</h3>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <span className="progress-text">
            {Object.values(bidStates).filter(s => s === 'submitted').length} / {players.length} bids collected
          </span>
        </div>
      </div>

      <div className="bid-players-list">
        {players.map(player => {
          const bidState = bidStates[player.id] || 'pending';
          const bid = localBids[player.id];
          const isCurrentPlayer = currentPlayer && currentPlayer.id === player.id;

          return (
            <div 
              key={player.id}
              className={`bid-player-item ${bidState} ${isCurrentPlayer ? 'current-player' : ''}`}
            >
              <div className="player-info">
                <div className="player-name">
                  {player.name}
                  {isCurrentPlayer && <span className="you-label">(You)</span>}
                </div>
                <div className={`bid-status bid-${bidState}`}>
                  <span className="status-icon">{getBidStatusIcon(bidState)}</span>
                  <span className="status-text">{getBidStatusText(bidState)}</span>
                </div>
              </div>
              
              <div className="bid-display">
                {bid !== undefined ? (
                  <span className={`bid-value bid-${bidState}`}>
                    {bid}
                  </span>
                ) : (
                  <span className="bid-placeholder">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNotification && (
        <div className="bid-notification bid-complete-notification">
          <div className="notification-content">
            <span className="notification-icon">🎯</span>
            <span className="notification-text">All bids collected!</span>
          </div>
        </div>
      )}

      <div className="bid-collection-footer">
        <div className="bid-legend">
          <div className="legend-item">
            <span className="legend-color submitted"></span>
            <span>Submitted</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pending"></span>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <span className="legend-color invalid"></span>
            <span>Invalid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidCollection;