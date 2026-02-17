import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const GameBoard = ({ players, maxRounds = 10 }) => {
  const [gameState, setGameState] = useState({
    currentRound: 1,
    gamePhase: 'bidding',
    roundHistory: [],
    currentRoundData: {
      bids: {},
      tricks: {},
      scores: {}
    },
    totalScores: players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {})
  });

  const [isGameComplete, setIsGameComplete] = useState(false);

  // Handle score submission and automatic round advancement
  const handleScoreSubmission = (roundScores) => {
    try {
      // Calculate and update total scores
      const updatedTotalScores = { ...gameState.totalScores };
      Object.keys(roundScores).forEach(playerId => {
        updatedTotalScores[playerId] += roundScores[playerId] || 0;
      });

      // Create round history entry
      const roundResult = {
        round: gameState.currentRound,
        bids: { ...gameState.currentRoundData.bids },
        tricks: { ...gameState.currentRoundData.tricks },
        scores: { ...roundScores },
        timestamp: Date.now()
      };

      // Update game state with completed round
      setGameState(prevState => ({
        ...prevState,
        totalScores: updatedTotalScores,
        roundHistory: [...prevState.roundHistory, roundResult]
      }));

      // Automatically advance to next round
      handleNextRound();
    } catch (error) {
      console.error('Error handling score submission:', error);
    }
  };

  // Handle automatic round advancement
  const handleNextRound = () => {
    try {
      const nextRound = gameState.currentRound + 1;
      
      // Check if game should end
      if (nextRound > maxRounds) {
        setIsGameComplete(true);
        return;
      }

      // Advance to next round
      setGameState(prevState => ({
        ...prevState,
        currentRound: nextRound,
        gamePhase: 'bidding', // Reset to first phase of new round
        currentRoundData: {
          bids: {},
          tricks: {},
          scores: {}
        }
      }));
    } catch (error) {
      console.error('Error advancing to next round:', error);
    }
  };

  // Handle bid submission
  const handleBidSubmission = (playerId, bid) => {
    setGameState(prevState => ({
      ...prevState,
      currentRoundData: {
        ...prevState.currentRoundData,
        bids: {
          ...prevState.currentRoundData.bids,
          [playerId]: bid
        }
      }
    }));

    // Check if all players have bid
    const allPlayersBid = players.every(player => 
      gameState.currentRoundData.bids[player.id] !== undefined || playerId === player.id
    );

    if (allPlayersBid) {
      setGameState(prevState => ({
        ...prevState,
        gamePhase: 'playing'
      }));
    }
  };

  // Handle trick submission
  const handleTrickSubmission = (playerId, tricks) => {
    setGameState(prevState => ({
      ...prevState,
      currentRoundData: {
        ...prevState.currentRoundData,
        tricks: {
          ...prevState.currentRoundData.tricks,
          [playerId]: tricks
        }
      }
    }));

    // Check if all players have entered tricks
    const allTricksEntered = players.every(player => 
      gameState.currentRoundData.tricks[player.id] !== undefined || playerId === player.id
    );

    if (allTricksEntered) {
      setGameState(prevState => ({
        ...prevState,
        gamePhase: 'scoring'
      }));
    }
  };

  // Calculate scores for current round
  const calculateRoundScores = () => {
    const scores = {};
    players.forEach(player => {
      const bid = gameState.currentRoundData.bids[player.id] || 0;
      const tricks = gameState.currentRoundData.tricks[player.id] || 0;
      
      // Basic scoring logic: 10 + bid if exact, 0 if not
      if (bid === tricks) {
        scores[player.id] = 10 + bid;
      } else {
        scores[player.id] = 0;
      }
    });
    return scores;
  };

  if (isGameComplete) {
    const winner = Object.entries(gameState.totalScores)
      .reduce((a, b) => a[1] > b[1] ? a : b);
    
    return (
      <div className="game-board game-complete">
        <h1>Game Complete!</h1>
        <h2>Winner: {players.find(p => p.id === winner[0])?.name} with {winner[1]} points</h2>
        <div className="final-scores">
          <h3>Final Scores:</h3>
          {Object.entries(gameState.totalScores).map(([playerId, score]) => (
            <div key={playerId} className="score-entry">
              {players.find(p => p.id === playerId)?.name}: {score}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>Spades Game</h1>
        <div className="game-info">
          <span>Round: {gameState.currentRound}/{maxRounds}</span>
          <span>Phase: {gameState.gamePhase}</span>
        </div>
      </div>

      <div className="current-scores">
        <h3>Current Totals:</h3>
        {players.map(player => (
          <div key={player.id} className="player-score">
            {player.name}: {gameState.totalScores[player.id]}
          </div>
        ))}
      </div>

      {gameState.gamePhase === 'bidding' && (
        <div className="bidding-phase">
          <h3>Bidding Phase</h3>
          {players.map(player => (
            <div key={player.id} className="player-bid">
              <label>{player.name}:</label>
              <input 
                type="number" 
                min="0" 
                max="13"
                onChange={(e) => handleBidSubmission(player.id, parseInt(e.target.value))}
                value={gameState.currentRoundData.bids[player.id] || ''}
              />
            </div>
          ))}
        </div>
      )}

      {gameState.gamePhase === 'playing' && (
        <div className="playing-phase">
          <h3>Playing Phase - Enter Tricks Won</h3>
          {players.map(player => (
            <div key={player.id} className="player-tricks">
              <label>{player.name} (bid: {gameState.currentRoundData.bids[player.id]}):</label>
              <input 
                type="number" 
                min="0" 
                max="13"
                onChange={(e) => handleTrickSubmission(player.id, parseInt(e.target.value))}
                value={gameState.currentRoundData.tricks[player.id] || ''}
              />
            </div>
          ))}
        </div>
      )}

      {gameState.gamePhase === 'scoring' && (
        <div className="scoring-phase">
          <h3>Round {gameState.currentRound} Results</h3>
          {players.map(player => {
            const bid = gameState.currentRoundData.bids[player.id];
            const tricks = gameState.currentRoundData.tricks[player.id];
            const roundScore = calculateRoundScores()[player.id];
            return (
              <div key={player.id} className="round-result">
                {player.name}: Bid {bid}, Made {tricks}, Score: {roundScore}
              </div>
            );
          })}
          <button 
            className="advance-round-btn"
            onClick={() => handleScoreSubmission(calculateRoundScores())}
          >
            {gameState.currentRound >= maxRounds ? 'Finish Game' : 'Next Round'}
          </button>
        </div>
      )}

      {gameState.roundHistory.length > 0 && (
        <div className="round-history">
          <h3>Round History</h3>
          {gameState.roundHistory.map(round => (
            <div key={round.round} className="history-entry">
              <strong>Round {round.round}:</strong>
              {players.map(player => (
                <span key={player.id} className="player-history">
                  {player.name}: {round.scores[player.id]} pts
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameBoard;