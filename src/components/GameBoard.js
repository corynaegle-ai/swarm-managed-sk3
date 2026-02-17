import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { checkBidCollectionComplete, advanceToNextPhase } from '../utils/gameLogic';
import BidCollection from './BidCollection';
import TrickTaking from './TrickTaking';

const GameBoard = () => {
  const { gameState, updateGameState } = useGameState();
  const { currentPhase, currentRound, bids, players } = gameState;

  // Monitor bid collection completion status
  useEffect(() => {
    if (currentPhase === 'COLLECTING_BIDS') {
      const isComplete = checkBidCollectionComplete(bids, players);
      if (isComplete) {
        handleBidCollectionComplete();
      }
    }
  }, [bids, currentPhase, players]);

  // Handle bid collection completion and advance to trick-taking
  const handleBidCollectionComplete = () => {
    const nextPhase = advanceToNextPhase(currentPhase);
    updateGameState({
      currentPhase: nextPhase,
      message: 'All bids collected. Starting trick-taking phase.'
    });
  };

  // Start new round with bid collection phase
  const startNewRound = () => {
    updateGameState({
      currentPhase: 'COLLECTING_BIDS',
      currentRound: currentRound + 1,
      bids: {},
      message: `Round ${currentRound + 1} started. Collecting bids...`
    });
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'COLLECTING_BIDS':
        return (
          <BidCollection
            onBidCollectionComplete={handleBidCollectionComplete}
            players={players}
            currentRound={currentRound}
          />
        );
      case 'TRICK_TAKING':
        return (
          <TrickTaking
            players={players}
            bids={bids}
            currentRound={currentRound}
            onRoundComplete={startNewRound}
          />
        );
      default:
        return <div>Unknown game phase: {currentPhase}</div>;
    }
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Spades Game - Round {currentRound}</h2>
        <p className="phase-indicator">Phase: {currentPhase.replace('_', ' ')}</p>
        {gameState.message && <p className="game-message">{gameState.message}</p>}
      </div>
      
      <div className="game-content">
        {renderCurrentPhase()}
      </div>
      
      {currentPhase === 'WAITING' && (
        <button onClick={startNewRound} className="start-round-btn">
          Start New Round
        </button>
      )}
    </div>
  );
};

export default GameBoard;