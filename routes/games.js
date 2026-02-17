const express = require('express');
const router = express.Router();

// Mock database - in a real app this would be a proper database
let games = {};
let players = {};

// GET /api/games/:gameId/players/:playerId/bonus - Get current bonus points
router.get('/:gameId/players/:playerId/bonus', (req, res) => {
  try {
    const { gameId, playerId } = req.params;
    
    // Validate game exists
    if (!games[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Validate player exists
    if (!players[playerId]) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // Initialize bonus points if not set
    if (players[playerId].bonus_points === undefined) {
      players[playerId].bonus_points = 0;
    }
    
    res.json({
      gameId,
      playerId,
      bonus_points: players[playerId].bonus_points
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/games/:gameId/players/:playerId/bonus - Update bonus points
router.put('/:gameId/players/:playerId/bonus', (req, res) => {
  try {
    const { gameId, playerId } = req.params;
    const { bonus_points } = req.body;
    
    // Validate input
    if (typeof bonus_points !== 'number' || bonus_points < 0) {
      return res.status(400).json({ error: 'Invalid bonus_points value. Must be a non-negative number.' });
    }
    
    // Validate game exists
    if (!games[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Validate player exists
    if (!players[playerId]) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // Check if player's bid was exactly correct
    if (!players[playerId].bid_correct) {
      return res.status(400).json({ error: 'Bonus points can only be applied when player\'s bid was exactly correct' });
    }
    
    // Update bonus points
    players[playerId].bonus_points = bonus_points;
    
    res.json({
      gameId,
      playerId,
      bonus_points: players[playerId].bonus_points,
      message: 'Bonus points updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper routes for testing - create game and player
router.post('/', (req, res) => {
  const gameId = 'game_' + Date.now();
  games[gameId] = {
    id: gameId,
    created_at: new Date().toISOString()
  };
  res.json(games[gameId]);
});

router.post('/:gameId/players', (req, res) => {
  const { gameId } = req.params;
  const { bid_correct } = req.body;
  
  if (!games[gameId]) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const playerId = 'player_' + Date.now();
  players[playerId] = {
    id: playerId,
    gameId,
    bid_correct: bid_correct || false,
    bonus_points: 0
  };
  
  res.json(players[playerId]);
});

module.exports = router;