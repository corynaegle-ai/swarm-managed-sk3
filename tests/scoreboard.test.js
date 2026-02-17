const request = require('supertest');
const express = require('express');
const scoreboardRouter = require('../routes/scoreboard');

const app = express();
app.use('/api/scoreboard', scoreboardRouter);

describe('GET /api/scoreboard', () => {
  test('should return scoreboard data with proper structure', async () => {
    const response = await request(app)
      .get('/api/scoreboard')
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('scoreboard');
    expect(response.body.data).toHaveProperty('current_round');
    expect(response.body.data).toHaveProperty('total_players');
    expect(response.body.data).toHaveProperty('has_scores');
  });

  test('should handle empty game state gracefully', async () => {
    const response = await request(app)
      .get('/api/scoreboard');

    if (response.body.data.scoreboard.length === 0) {
      expect(response.body.success).toBe(true);
      expect(response.body.data.current_round).toBe(0);
      expect(response.body.data.total_players).toBe(0);
      expect(response.body.data.has_scores).toBe(false);
    }
  });

  test('should return players with round breakdown when data exists', async () => {
    const response = await request(app)
      .get('/api/scoreboard');

    if (response.body.data.scoreboard.length > 0) {
      const player = response.body.data.scoreboard[0];
      expect(player).toHaveProperty('player_id');
      expect(player).toHaveProperty('player_name');
      expect(player).toHaveProperty('rounds');
      expect(player).toHaveProperty('total_score');
      expect(player).toHaveProperty('rounds_played');
    }
  });
});