import React, { useState } from 'react';
import './App.css';
import PlayerSetup from './components/PlayerSetup';

// Game state enumeration
const GAME_STATE = {
  SETUP: 'setup',
  PLAYING: 'playing',
  FINISHED: 'finished'
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.SETUP);
  const [players, setPlayers] = useState([]);

  const handleStartGame = (playerData) => {
    setPlayers(playerData);
    setGameState(GAME_STATE.PLAYING);
  };

  const handleReturnToSetup = () => {
    setGameState(GAME_STATE.SETUP);
  };

  const renderCurrentScreen = () => {
    switch (gameState) {
      case GAME_STATE.SETUP:
        return (
          <PlayerSetup
            onStartGame={handleStartGame}
            players={players}
          />
        );
      case GAME_STATE.PLAYING:
        return (
          <div className="game-screen">
            <div className="game-header">
              <h2>Game in Progress</h2>
              <button
                className="return-to-setup-btn"
                onClick={handleReturnToSetup}
              >
                Return to Setup
              </button>
            </div>
            <div className="players-info">
              <h3>Players:</h3>
              <ul>
                {players.map((player, index) => (
                  <li key={index}>
                    {player.name} ({player.type})
                  </li>
                ))}
              </ul>
            </div>
            <div className="game-placeholder">
              <p>Game components will be rendered here...</p>
              <p>Player data is available as props: {JSON.stringify(players, null, 2)}</p>
            </div>
          </div>
        );
      case GAME_STATE.FINISHED:
        return (
          <div className="game-finished">
            <h2>Game Finished</h2>
            <button onClick={handleReturnToSetup}>Play Again</button>
          </div>
        );
      default:
        return <div>Unknown game state</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic-Tac-Toe Game</h1>
      </header>
      <main className="App-main">
        {renderCurrentScreen()}
      </main>
    </div>
  );
}

export default App;