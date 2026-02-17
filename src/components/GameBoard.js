import React, { useState, useEffect } from 'react';

const GameBoard = () => {
  // Game phase state management with scoring phase
  const [gamePhase, setGamePhase] = useState('bidding'); // 'bidding', 'scoring', 'complete'
  const [biddingComplete, setBiddingComplete] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', bid: null, score: 0 },
    { id: 2, name: 'Player 2', bid: null, score: 0 },
    { id: 3, name: 'Player 3', bid: null, score: 0 },
    { id: 4, name: 'Player 4', bid: null, score: 0 }
  ]);

  // Handle bidding completion and transition to scoring
  const handleBiddingComplete = () => {
    console.log('Bidding phase complete, transitioning to scoring phase');
    setGamePhase('scoring');
    setBiddingComplete(true);
  };

  // Check if all players have placed bids
  const checkBiddingComplete = () => {
    const allBidsPlaced = players.every(player => player.bid !== null);
    if (allBidsPlaced && gamePhase === 'bidding') {
      handleBiddingComplete();
    }
  };

  // Handle bid placement
  const handleBidPlacement = (playerId, bid) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === playerId ? { ...player, bid: bid } : player
      )
    );
  };

  // Handle score updates
  const handleScoreUpdate = (playerId, score) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === playerId ? { ...player, score: score } : player
      )
    );
  };

  // Log phase changes for verification
  useEffect(() => {
    console.log(`Game phase changed to: ${gamePhase}`);
  }, [gamePhase]);

  // Check for bidding completion whenever players state changes
  useEffect(() => {
    checkBiddingComplete();
  }, [players, gamePhase]);

  // Render bidding interface
  const renderBiddingInterface = () => (
    <div className="bidding-interface">
      <h2>Bidding Phase</h2>
      <div className="players-grid">
        {players.map(player => (
          <div key={player.id} className="player-card">
            <h3>{player.name}</h3>
            <div className="bid-input">
              <label>Bid:</label>
              <input 
                type="number" 
                value={player.bid || ''} 
                onChange={(e) => handleBidPlacement(player.id, parseInt(e.target.value))}
                placeholder="Enter bid"
              />
            </div>
            <div className="current-bid">
              Current bid: {player.bid || 'Not placed'}
            </div>
          </div>
        ))}
      </div>
      <div className="phase-status">
        Status: {players.filter(p => p.bid !== null).length}/{players.length} bids placed
      </div>
    </div>
  );

  // Render scoring interface
  const renderScoringInterface = () => (
    <div className="scoring-interface">
      <h2>Scoring Phase</h2>
      <div className="players-grid">
        {players.map(player => (
          <div key={player.id} className="player-card">
            <h3>{player.name}</h3>
            <div className="player-info">
              <div className="bid-display">
                Bid: {player.bid}
              </div>
              <div className="score-input">
                <label>Score:</label>
                <input 
                  type="number" 
                  value={player.score || ''} 
                  onChange={(e) => handleScoreUpdate(player.id, parseInt(e.target.value))}
                  placeholder="Enter score"
                />
              </div>
              <div className="current-score">
                Current score: {player.score}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="scoring-actions">
        <button onClick={() => setGamePhase('complete')}>Complete Round</button>
      </div>
    </div>
  );

  return (
    <div className="game-board">
      <header className="game-header">
        <h1>Spades Game</h1>
        <div className="phase-indicator">
          Current Phase: <span className="phase-label">{gamePhase}</span>
        </div>
      </header>
      
      <main className="game-content">
        {gamePhase === 'bidding' && renderBiddingInterface()}
        {gamePhase === 'scoring' && renderScoringInterface()}
        {gamePhase === 'complete' && (
          <div className="game-complete">
            <h2>Round Complete</h2>
            <div className="final-scores">
              {players.map(player => (
                <div key={player.id} className="final-score">
                  {player.name}: Bid {player.bid}, Scored {player.score}
                </div>
              ))}
            </div>
            <button onClick={() => {
              setGamePhase('bidding');
              setPlayers(players.map(p => ({ ...p, bid: null, score: 0 })));
              setBiddingComplete(false);
            }}>New Round</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GameBoard;