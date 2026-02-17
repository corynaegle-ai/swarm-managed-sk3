import React, { useState, useEffect } from 'react';
import BidCollection from './BidCollection';

const GameBoard = () => {
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup -> bidding -> playing -> scoring
    currentRound: 1,
    handCount: 0,
    players: [
      { id: 1, name: 'Player 1', bid: null, tricks: 0 },
      { id: 2, name: 'Player 2', bid: null, tricks: 0 },
      { id: 3, name: 'Player 3', bid: null, tricks: 0 },
      { id: 4, name: 'Player 4', bid: null, tricks: 0 }
    ],
    dealer: 0,
    currentPlayer: 0
  });

  // Initialize hand count based on round
  useEffect(() => {
    const calculateHandCount = (round) => {
      if (round <= 10) return round;
      if (round <= 20) return 21 - round;
      return 1; // Final round
    };

    setGameState(prev => ({
      ...prev,
      handCount: calculateHandCount(prev.currentRound)
    }));
  }, [gameState.currentRound]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'bidding'
    }));
  };

  const handleAllBidsSubmitted = (bids) => {
    // Update players with their bids
    const updatedPlayers = gameState.players.map(player => {
      const playerBid = bids.find(bid => bid.playerId === player.id);
      return {
        ...player,
        bid: playerBid ? playerBid.bid : null
      };
    });

    // Transition to playing phase
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      phase: 'playing'
    }));
  };

  const nextRound = () => {
    const nextRoundNumber = gameState.currentRound + 1;
    
    setGameState(prev => ({
      ...prev,
      currentRound: nextRoundNumber,
      phase: nextRoundNumber <= 21 ? 'bidding' : 'complete',
      players: prev.players.map(player => ({
        ...player,
        bid: null,
        tricks: 0
      })),
      dealer: (prev.dealer + 1) % prev.players.length,
      currentPlayer: (prev.dealer + 1) % prev.players.length
    }));
  };

  const renderGamePhase = () => {
    switch (gameState.phase) {
      case 'setup':
        return (
          <div className="setup-phase">
            <h2>Skull King - Round {gameState.currentRound}</h2>
            <p>Cards in hand: {gameState.handCount}</p>
            <button onClick={startGame} className="start-game-btn">
              Start Game
            </button>
          </div>
        );

      case 'bidding':
        return (
          <div className="bidding-phase">
            <h2>Bidding Phase - Round {gameState.currentRound}</h2>
            <p>Cards in hand: {gameState.handCount}</p>
            <BidCollection
              players={gameState.players}
              currentRound={gameState.currentRound}
              handCount={gameState.handCount}
              onAllBidsSubmitted={handleAllBidsSubmitted}
            />
          </div>
        );

      case 'playing':
        return (
          <div className="playing-phase">
            <h2>Playing Phase - Round {gameState.currentRound}</h2>
            <p>Cards in hand: {gameState.handCount}</p>
            <div className="player-bids">
              <h3>Player Bids:</h3>
              {gameState.players.map(player => (
                <div key={player.id} className="player-bid">
                  {player.name}: {player.bid} tricks
                </div>
              ))}
            </div>
            <button onClick={nextRound} className="next-round-btn">
              Next Round
            </button>
          </div>
        );

      case 'complete':
        return (
          <div className="game-complete">
            <h2>Game Complete!</h2>
            <p>Final scores will be displayed here</p>
          </div>
        );

      default:
        return <div>Unknown game phase</div>;
    }
  };

  return (
    <div className="game-board">
      {renderGamePhase()}
    </div>
  );
};

export default GameBoard;