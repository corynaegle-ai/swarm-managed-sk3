import React, { useState, useContext, useEffect } from 'react';
import './BidInput.css';

// Mock GameContext - replace with actual game state management
const GameContext = React.createContext({
  currentPlayer: null,
  onBidSubmit: () => {},
  gameState: 'bidding',
  maxBid: 13
});

const BidInput = ({ onBidChange, disabled = false }) => {
  const { currentPlayer, onBidSubmit, gameState, maxBid = 13 } = useContext(GameContext);
  const [bidValue, setBidValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onBidChange && onBidChange(bidValue, isValid);
  }, [bidValue, isValid, onBidChange]);

  const validateBid = (value) => {
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return false;
    }
    
    if (numValue < 0) {
      setError('Bid cannot be negative');
      return false;
    }
    
    if (numValue > maxBid) {
      setError(`Bid cannot exceed ${maxBid}`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBidValue(value);
    
    if (value === '') {
      setIsValid(true);
      setError('');
      return;
    }
    
    const valid = validateBid(value);
    setIsValid(valid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bidValue || bidValue === '') {
      setError('Please enter a bid');
      setIsValid(false);
      return;
    }
    
    if (!isValid) {
      return;
    }
    
    const numValue = parseInt(bidValue, 10);
    setIsSubmitted(true);
    
    // Call the game context submit function
    onBidSubmit && onBidSubmit(currentPlayer?.id, numValue);
    
    // Reset form after submission
    setTimeout(() => {
      setBidValue('');
      setIsSubmitted(false);
      setError('');
      setIsValid(true);
    }, 2000);
  };

  const handleReset = () => {
    setBidValue('');
    setIsSubmitted(false);
    setError('');
    setIsValid(true);
  };

  if (gameState !== 'bidding' || !currentPlayer) {
    return null;
  }

  return (
    <div className="bid-input-container">
      <div className="bid-input-header">
        <h4>Your Bid</h4>
        <span className="bid-range-hint">Enter a number from 0 to {maxBid}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="bid-input-form">
        <div className="input-group">
          <div className={`input-wrapper ${!isValid ? 'error' : ''} ${isSubmitted ? 'submitted' : ''}`}>
            <input
              type="number"
              min="0"
              max={maxBid}
              value={bidValue}
              onChange={handleInputChange}
              disabled={disabled || isSubmitted}
              className={`bid-input ${!isValid ? 'invalid' : ''} ${isSubmitted ? 'submitted' : ''}`}
              placeholder="Enter your bid..."
              autoComplete="off"
            />
            
            {isSubmitted && (
              <div className="input-status submitted">
                <span className="status-icon">✓</span>
              </div>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="button-group">
          {!isSubmitted ? (
            <>
              <button
                type="submit"
                disabled={disabled || !bidValue || !isValid}
                className={`submit-btn ${isValid && bidValue ? 'ready' : ''}`}
              >
                Submit Bid
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={disabled || !bidValue}
                className="reset-btn"
              >
                Clear
              </button>
            </>
          ) : (
            <div className="submission-feedback">
              <span className="feedback-icon">🎯</span>
              <span className="feedback-text">Bid submitted successfully!</span>
            </div>
          )}
        </div>
      </form>
      
      <div className="bid-input-footer">
        <div className="player-info">
          <span className="player-label">Playing as:</span>
          <span className="player-name">{currentPlayer?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default BidInput;