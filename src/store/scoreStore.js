import { reactive } from 'vue';

// Centralized store for score management across rounds
const scoreStore = reactive({
  // Current round number (1-based)
  currentRound: 1,
  
  // Array to store scores for each round
  // Structure: [{ roundNumber, playerScores: {playerId: score} }]
  roundScores: [],
  
  // Current round player scores
  currentRoundScores: {},
  
  // Game configuration
  gameConfig: {
    totalRounds: 5,
    handsPerRound: 10 // Default, can be dynamic
  },
  
  // Initialize a new round
  initializeRound(roundNumber, handCount = 10) {
    this.currentRound = roundNumber;
    this.gameConfig.handsPerRound = handCount;
    this.currentRoundScores = {};
  },
  
  // Update score for a player in current round
  updatePlayerScore(playerId, score) {
    if (!this.currentRoundScores[playerId]) {
      this.currentRoundScores[playerId] = 0;
    }
    this.currentRoundScores[playerId] = score;
  },
  
  // Complete current round and save scores
  completeRound() {
    const roundData = {
      roundNumber: this.currentRound,
      playerScores: { ...this.currentRoundScores },
      handsPlayed: this.gameConfig.handsPerRound
    };
    
    // Check if round already exists (for overwrites)
    const existingIndex = this.roundScores.findIndex(r => r.roundNumber === this.currentRound);
    if (existingIndex >= 0) {
      this.roundScores[existingIndex] = roundData;
    } else {
      this.roundScores.push(roundData);
    }
  },
  
  // Get scores for a specific round
  getRoundScores(roundNumber) {
    return this.roundScores.find(r => r.roundNumber === roundNumber);
  },
  
  // Get total cumulative scores across all completed rounds
  getTotalScores() {
    const totals = {};
    
    this.roundScores.forEach(round => {
      Object.entries(round.playerScores).forEach(([playerId, score]) => {
        if (!totals[playerId]) {
          totals[playerId] = 0;
        }
        totals[playerId] += score;
      });
    });
    
    return totals;
  },
  
  // Get score history for all rounds
  getScoreHistory() {
    return this.roundScores.map(round => ({
      round: round.roundNumber,
      scores: round.playerScores,
      hands: round.handsPlayed
    }));
  },
  
  // Calculate average score per hand for dynamic hand counts
  getAverageScorePerHand(playerId) {
    let totalScore = 0;
    let totalHands = 0;
    
    this.roundScores.forEach(round => {
      if (round.playerScores[playerId]) {
        totalScore += round.playerScores[playerId];
        totalHands += round.handsPlayed;
      }
    });
    
    return totalHands > 0 ? totalScore / totalHands : 0;
  },
  
  // Reset all scores and rounds
  resetGame() {
    this.currentRound = 1;
    this.roundScores = [];
    this.currentRoundScores = {};
    this.gameConfig.handsPerRound = 10;
  },
  
  // Transition to next round
  nextRound(handCount) {
    this.completeRound();
    this.initializeRound(this.currentRound + 1, handCount);
  }
});

export default scoreStore;