import React, { useState } from 'react';
import BidInput from './BidInput';

const BidCollection = ({ players, currentRound, handCount, onAllBidsSubmitted }) => {
  const [bids, setBids] = useState({});
  const [currentBidder, setCurrentBidder] = useState(0);
  const [allBidsSubmitted, setAllBidsSubmitted] = useState(false);

  const handleBidSubmit = (playerId, bid) => {
    const newBids = { ...bids, [playerId]: bid };
    setBids(newBids);

    // Move to next player
    const nextBidder = currentBidder + 1;
    if (nextBidder < players.length) {
      setCurrentBidder(nextBidder);
    } else {
      // All bids collected
      setAllBidsSubmitted(true);
      
      // Convert bids object to array format expected by parent
      const bidArray = Object.entries(newBids).map(([playerId, bid]) => ({
        playerId: parseInt(playerId),
        bid: parseInt(bid)
      }));
      
      onAllBidsSubmitted(bidArray);
    }
  };

  if (allBidsSubmitted) {
    return (
      <div className="bid-collection-complete">
        <h3>All bids collected!</h3>
        <div className="bid-summary">
          {players.map(player => (
            <div key={player.id} className="player-bid-summary">
              {player.name}: {bids[player.id]} tricks
            </div>
          ))}
        </div>
        <p>Proceeding to card play...</p>
      </div>
    );
  }

  return (
    <div className="bid-collection">
      <h3>Collect Bids - Round {currentRound}</h3>
      <p>Each player has {handCount} cards</p>
      
      <div className="bid-progress">
        <p>Collecting bid from: <strong>{players[currentBidder]?.name}</strong></p>
        <p>Progress: {currentBidder + 1} of {players.length}</p>
      </div>

      <BidInput
        player={players[currentBidder]}
        maxBid={handCount}
        onBidSubmit={handleBidSubmit}
      />

      {Object.keys(bids).length > 0 && (
        <div className="collected-bids">
          <h4>Bids Collected:</h4>
          {Object.entries(bids).map(([playerId, bid]) => {
            const player = players.find(p => p.id === parseInt(playerId));
            return (
              <div key={playerId} className="collected-bid">
                {player?.name}: {bid} tricks
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BidCollection;