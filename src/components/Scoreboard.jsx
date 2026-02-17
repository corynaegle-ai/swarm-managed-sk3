import React, { useState, useEffect } from 'react';
import '../styles/Scoreboard.css';

const Scoreboard = ({ gameId, currentRound = 1 }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection and fetch initial data
  useEffect(() => {
    const initializeScoreboard = async () => {
      try {
        // Fetch initial player data
        await fetchInitialData();
        
        // Setup WebSocket for real-time updates
        setupWebSocket();
      } catch (err) {
        setError('Failed to initialize scoreboard');
        console.error('Scoreboard initialization error:', err);
      }
    };

    initializeScoreboard();

    // Cleanup WebSocket on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [gameId]);

  // Fetch initial player data
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual endpoint
      const response = await fetch(`/api/games/${gameId}/scores`);
      if (!response.ok) throw new Error('Failed to fetch scores');
      
      const data = await response.json();
      setPlayers(data.players || []);
      setError(null);
    } catch (err) {
      setError('Failed to load player data');
      // Fallback to mock data for development
      setPlayers([
        {
          id: 1,
          name: 'Player 1',
          scores: [85, 92, 78, 88, 0, 0, 0, 0, 0, 0],
          total: 343
        },
        {
          id: 2,
          name: 'Player 2',
          scores: [78, 85, 90, 82, 0, 0, 0, 0, 0, 0],
          total: 335
        },
        {
          id: 3,
          name: 'Player 3',
          scores: [92, 88, 85, 91, 0, 0, 0, 0, 0, 0],
          total: 356
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket connection for real-time updates
  const setupWebSocket = () => {
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || `ws://localhost:8080/ws/game/${gameId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SCORE_UPDATE') {
            updatePlayerScores(data.payload);
          }
        } catch (err) {
          console.error('WebSocket message parsing error:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Fallback to polling if WebSocket fails
        setupPolling();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (gameId) {
            setupWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      console.error('WebSocket setup error:', err);
      setupPolling();
    }
  };

  // Fallback polling mechanism
  const setupPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/scores`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.players || []);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000); // Poll every 5 seconds

    // Store interval ID for cleanup
    return () => clearInterval(pollInterval);
  };

  // Update player scores from WebSocket message
  const updatePlayerScores = (scoreData) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => {
        const updatedPlayer = scoreData.find(p => p.id === player.id);
        return updatedPlayer ? { ...player, ...updatedPlayer } : player;
      })
    );
  };

  // Calculate running total for a player up to a specific round
  const getRunningTotal = (scores, upToRound) => {
    return scores.slice(0, upToRound + 1).reduce((sum, score) => sum + (score || 0), 0);
  };

  // Generate round headers (assuming max 10 rounds)
  const maxRounds = 10;
  const roundHeaders = Array.from({ length: maxRounds }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="scoreboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading scoreboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scoreboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchInitialData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h2>Game Scoreboard</h2>
        <div className="current-round-indicator">
          Current Round: <span className="round-number">{currentRound}</span>
        </div>
      </div>
      
      <div className="scoreboard-wrapper">
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th className="player-name-header">Player</th>
              {roundHeaders.map(round => (
                <th 
                  key={round} 
                  className={`round-header ${
                    round === currentRound ? 'current-round' : ''
                  }`}
                >
                  R{round}
                </th>
              ))}
              <th className="total-header">Total</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className={`player-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <td className="player-name">{player.name}</td>
                {roundHeaders.map(round => {
                  const roundIndex = round - 1;
                  const score = player.scores[roundIndex];
                  return (
                    <td 
                      key={round} 
                      className={`score-cell ${
                        round === currentRound ? 'current-round' : ''
                      } ${
                        score > 0 ? 'has-score' : 'no-score'
                      }`}
                    >
                      {score > 0 ? score : '-'}
                    </td>
                  );
                })}
                <td className="total-score">{player.total || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="scoreboard-footer">
        <div className="connection-status">
          {socket && socket.readyState === WebSocket.OPEN ? (
            <span className="connected">🟢 Live Updates Active</span>
          ) : (
            <span className="disconnected">🟡 Polling for Updates</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;