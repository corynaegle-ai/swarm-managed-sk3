import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = ({ onPlayersReady }) => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [validationError, setValidationError] = useState('');

  const generateUniqueId = () => {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  };

  const addPlayer = (e) => {
    e.preventDefault();
    
    if (!newPlayerName.trim()) {
      setValidationError('Player name is required');
      return;
    }

    if (players.length >= 8) {
      setValidationError('Maximum 8 players allowed');
      return;
    }

    const newPlayer = {
      id: generateUniqueId(),
      name: newPlayerName.trim()
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setValidationError('');
  };

  const startEditingPlayer = (playerId, currentName) => {
    setEditingPlayerId(playerId);
    setEditingName(currentName);
    setValidationError('');
  };

  const savePlayerEdit = () => {
    if (!editingName.trim()) {
      setValidationError('Player name is required');
      return;
    }

    setPlayers(players.map(player => 
      player.id === editingPlayerId 
        ? { ...player, name: editingName.trim() }
        : player
    ));
    
    setEditingPlayerId(null);
    setEditingName('');
    setValidationError('');
  };

  const cancelEdit = () => {
    setEditingPlayerId(null);
    setEditingName('');
    setValidationError('');
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId));
    if (editingPlayerId === playerId) {
      setEditingPlayerId(null);
      setEditingName('');
    }
    setValidationError('');
  };

  const startGame = () => {
    if (players.length < 2) {
      setValidationError('At least 2 players required to start the game');
      return;
    }
    
    setValidationError('');
    if (onPlayersReady) {
      onPlayersReady(players);
    }
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <form onSubmit={addPlayer} className="add-player-form">
        <div className="form-group">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="player-name-input"
            maxLength={50}
          />
          <button 
            type="submit" 
            disabled={players.length >= 8}
            className="add-player-btn"
          >
            Add Player
          </button>
        </div>
      </form>

      {validationError && (
        <div className="validation-error">
          {validationError}
        </div>
      )}

      <div className="player-list">
        <h3>Players ({players.length}/8)</h3>
        
        {players.length === 0 ? (
          <p className="no-players">No players added yet</p>
        ) : (
          <ul className="players">
            {players.map((player) => (
              <li key={player.id} className="player-item">
                {editingPlayerId === player.id ? (
                  <div className="edit-player">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="edit-player-input"
                      maxLength={50}
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={savePlayerEdit}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-player">
                    <span className="player-name">{player.name}</span>
                    <div className="player-actions">
                      <button 
                        onClick={() => startEditingPlayer(player.id, player.name)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => removePlayer(player.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="start-game-section">
        <button 
          onClick={startGame}
          disabled={players.length < 2}
          className="start-game-btn"
        >
          Start Game
        </button>
        
        {players.length < 2 && players.length > 0 && (
          <p className="min-players-note">
            Add at least {2 - players.length} more player{2 - players.length !== 1 ? 's' : ''} to start
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerSetup;