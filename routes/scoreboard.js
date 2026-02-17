const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * GET /api/scoreboard
 * Retrieves all players with their scores broken down by round
 * Returns player names, round-by-round scores, total scores, and current round indicator
 */
router.get('/', async (req, res) => {
  try {
    // Get all players
    const playersQuery = `SELECT id, name FROM players ORDER BY name`;
    const players = await new Promise((resolve, reject) => {
      db.all(playersQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get all scores with round information
    const scoresQuery = `
      SELECT 
        s.player_id,
        s.round,
        s.score,
        p.name as player_name
      FROM scores s
      JOIN players p ON s.player_id = p.id
      ORDER BY p.name, s.round
    `;
    
    const scores = await new Promise((resolve, reject) => {
      db.all(scoresQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get current round (highest round number with scores)
    const currentRoundQuery = `SELECT MAX(round) as current_round FROM scores`;
    const currentRoundResult = await new Promise((resolve, reject) => {
      db.get(currentRoundQuery, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const currentRound = currentRoundResult?.current_round || 0;

    // Build scoreboard data structure
    const scoreboard = players.map(player => {
      const playerScores = scores.filter(score => score.player_id === player.id);
      
      // Create round-by-round breakdown
      const rounds = {};
      let totalScore = 0;
      
      playerScores.forEach(score => {
        rounds[`round_${score.round}`] = score.score;
        totalScore += score.score;
      });

      return {
        player_id: player.id,
        player_name: player.name,
        rounds: rounds,
        total_score: totalScore,
        rounds_played: playerScores.length
      };
    });

    // Sort by total score (descending)
    scoreboard.sort((a, b) => b.total_score - a.total_score);

    const response = {
      success: true,
      data: {
        scoreboard: scoreboard,
        current_round: currentRound,
        total_players: players.length,
        has_scores: scores.length > 0
      },
      message: scoreboard.length === 0 ? 'No players found' : `Scoreboard retrieved for ${scoreboard.length} players`
    };

    res.json(response);

  } catch (error) {
    console.error('Error retrieving scoreboard:', error);
    
    // Handle empty game state gracefully
    if (error.code === 'SQLITE_ERROR' || error.message.includes('no such table')) {
      return res.json({
        success: true,
        data: {
          scoreboard: [],
          current_round: 0,
          total_players: 0,
          has_scores: false
        },
        message: 'Game not initialized - empty scoreboard'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve scoreboard',
      message: 'An error occurred while fetching player scores'
    });
  }
});

module.exports = router;