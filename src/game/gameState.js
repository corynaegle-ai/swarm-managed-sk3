import { calculateStandardBidScore } from '../scoring/standardScoring';

/**
 * Game state management for tracking players, rounds, and scores
 */
class GameState {
  constructor() {
    this.players = [];
    this.currentRound = null;
    this.rounds = [];
    this.gamePhase = 'setup'; // setup, bidding, playing, scoring, completed
  }

  /**
   * Add a player to the game
   * @param {string} playerId - Unique player identifier
   * @param {string} playerName - Player display name
   */
  addPlayer(playerId, playerName) {
    if (this.gamePhase !== 'setup') {
      throw new Error('Cannot add players after game has started');
    }
    
    const player = {
      id: playerId,
      name: playerName,
      totalScore: 0,
      rounds: []
    };
    
    this.players.push(player);
  }

  /**
   * Start a new round
   * @param {number} roundNumber - Round number
   * @param {number} cardsPerPlayer - Number of cards dealt to each player
   */
  startRound(roundNumber, cardsPerPlayer) {
    this.currentRound = {
      number: roundNumber,
      cardsPerPlayer,
      bids: new Map(),
      tricks: new Map(),
      scores: new Map(),
      phase: 'bidding' // bidding, playing, scoring
    };
    
    this.gamePhase = 'bidding';
  }

  /**
   * Record a player's bid for the current round
   * @param {string} playerId - Player identifier
   * @param {number} bid - Number of tricks bid
   */
  recordBid(playerId, bid) {
    if (!this.currentRound || this.currentRound.phase !== 'bidding') {
      throw new Error('Not in bidding phase');
    }
    
    this.currentRound.bids.set(playerId, bid);
  }

  /**
   * Record actual tricks taken by a player
   * @param {string} playerId - Player identifier
   * @param {number} tricks - Number of tricks taken
   */
  recordTricks(playerId, tricks) {
    if (!this.currentRound) {
      throw new Error('No active round');
    }
    
    this.currentRound.tricks.set(playerId, tricks);
  }

  /**
   * Update player scores using standard scoring system
   */
  updatePlayerScores() {
    if (!this.currentRound) {
      throw new Error('No active round to score');
    }

    // Calculate scores for each player using standard scoring
    for (const player of this.players) {
      const playerBid = this.currentRound.bids.get(player.id);
      const actualTricks = this.currentRound.tricks.get(player.id);
      
      if (playerBid === undefined || actualTricks === undefined) {
        throw new Error(`Missing bid or tricks data for player ${player.id}`);
      }

      // Use the imported standard scoring function
      const roundScore = calculateStandardBidScore(playerBid, actualTricks);
      
      // Store round score
      this.currentRound.scores.set(player.id, roundScore);
      
      // Update player's total score
      player.totalScore += roundScore;
      
      // Add round data to player's history
      player.rounds.push({
        round: this.currentRound.number,
        bid: playerBid,
        tricks: actualTricks,
        score: roundScore
      });
    }

    this.currentRound.phase = 'scoring';
  }

  /**
   * Complete the current round and add it to history
   */
  completeRound() {
    if (!this.currentRound || this.currentRound.phase !== 'scoring') {
      throw new Error('Round must be scored before completion');
    }

    this.rounds.push({ ...this.currentRound });
    this.currentRound = null;
    this.gamePhase = 'setup';
  }

  /**
   * Get current game state summary
   * @returns {Object} Game state summary
   */
  getGameState() {
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        totalScore: p.totalScore
      })),
      currentRound: this.currentRound ? {
        number: this.currentRound.number,
        cardsPerPlayer: this.currentRound.cardsPerPlayer,
        phase: this.currentRound.phase,
        bids: Object.fromEntries(this.currentRound.bids),
        tricks: Object.fromEntries(this.currentRound.tricks),
        scores: Object.fromEntries(this.currentRound.scores)
      } : null,
      gamePhase: this.gamePhase,
      roundsCompleted: this.rounds.length
    };
  }

  /**
   * Get player standings sorted by total score
   * @returns {Array} Players sorted by score (highest first)
   */
  getStandings() {
    return [...this.players]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({
        position: index + 1,
        id: player.id,
        name: player.name,
        totalScore: player.totalScore
      }));
  }
}

export default GameState;