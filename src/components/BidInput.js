import React, { useState } from 'react';

const BidInput = ({ player, maxBid, onBidSubmit }) => {
  const [bid, setBid] = useState('');
  const [error, setError] = useState('');

  const validateBid = (bidValue) => {
    const numBid = parseInt(bidValue);
    
    if (isNaN(numBid)) {
      return 'Bid must be a number';
    }
    
    if (numBid < 0) {
      return 'Bid cannot be negative';
    }
    
    if (numBid > maxBid) {
      return `Bid cannot exceed ${maxBid} (number of cards in hand)`;
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validateBid(bid);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    onBidSubmit(player.id, parseInt(bid));
    setBid(''); // Reset for next player
  };

  const handleBidChange = (e) => {
    const value = e.target.value;
    setBid(value);
    
    // Clear error when user starts typing a new value
    if (error) {
      setError('');
    }
  };

  return (
    <div className="bid-input">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor={`bid-${player.id}`}>
            {player.name}, enter your bid (0-{maxBid}):
          </label>
          <input
            id={`bid-${player.id}`}
            type="number"
            min="0"
            max={maxBid}
            value={bid}
            onChange={handleBidChange}
            placeholder="Enter bid"
            className={error ? 'error' : ''}
            autoFocus
          />
          <button type="submit" disabled={!bid}>
            Submit Bid
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
      
      <div className="bid-help">
        <p>Bid the number of tricks you think you'll win this round.</p>
        <p>You have {maxBid} cards in your hand.</p>
      </div>
    </div>
  );
};

export default BidInput;