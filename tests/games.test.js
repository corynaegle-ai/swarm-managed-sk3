const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');

const app = express();
app.use(express.json());
app.use('/api/games', gamesRouter);

describe('Bonus Points API', () => {
  let gameId, playerId;
  
  beforeEach(async () => {
    // Create a test game
    const gameResponse = await request(app)
      .post('/api/games')
      .expect(200);
    gameId = gameResponse.body.id;
    
    // Create a test player with correct bid
    const playerResponse = await request(app)
      .post(`/api/games/${gameId}/players`)
      .send({ bid_correct: true })
      .expect(200);
    playerId = playerResponse.body.id;
  });
  
  describe('GET /api/games/:gameId/players/:playerId/bonus', () => {
    it('should return current bonus points', async () => {
      const response = await request(app)
        .get(`/api/games/${gameId}/players/${playerId}/bonus`)
        .expect(200);
      
      expect(response.body).toHaveProperty('gameId', gameId);
      expect(response.body).toHaveProperty('playerId', playerId);
      expect(response.body).toHaveProperty('bonus_points', 0);
    });
    
    it('should return 404 for non-existent game', async () => {
      await request(app)
        .get(`/api/games/nonexistent/players/${playerId}/bonus`)
        .expect(404);
    });
    
    it('should return 404 for non-existent player', async () => {
      await request(app)
        .get(`/api/games/${gameId}/players/nonexistent/bonus`)
        .expect(404);
    });
  });
  
  describe('PUT /api/games/:gameId/players/:playerId/bonus', () => {
    it('should update bonus points for player with correct bid', async () => {
      const response = await request(app)
        .put(`/api/games/${gameId}/players/${playerId}/bonus`)
        .send({ bonus_points: 10 })
        .expect(200);
      
      expect(response.body).toHaveProperty('bonus_points', 10);
      expect(response.body).toHaveProperty('message', 'Bonus points updated successfully');
    });
    
    it('should return 400 for player with incorrect bid', async () => {
      // Create player with incorrect bid
      const incorrectPlayerResponse = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ bid_correct: false })
        .expect(200);
      
      await request(app)
        .put(`/api/games/${gameId}/players/${incorrectPlayerResponse.body.id}/bonus`)
        .send({ bonus_points: 10 })
        .expect(400);
    });
    
    it('should return 400 for invalid bonus points', async () => {
      await request(app)
        .put(`/api/games/${gameId}/players/${playerId}/bonus`)
        .send({ bonus_points: -5 })
        .expect(400);
      
      await request(app)
        .put(`/api/games/${gameId}/players/${playerId}/bonus`)
        .send({ bonus_points: 'invalid' })
        .expect(400);
    });
    
    it('should return 404 for non-existent game', async () => {
      await request(app)
        .put(`/api/games/nonexistent/players/${playerId}/bonus`)
        .send({ bonus_points: 10 })
        .expect(404);
    });
    
    it('should return 404 for non-existent player', async () => {
      await request(app)
        .put(`/api/games/${gameId}/players/nonexistent/bonus`)
        .send({ bonus_points: 10 })
        .expect(404);
    });
  });
});