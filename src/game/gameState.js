export class GameState {
  constructor(players) {
    this.players = players;
    this.rounds = [];
    this.currentRound = null;
    this.cumulativeScores = {};
    this.gameCompleted = false;
    
    // Initialize cumulative scores
    players.forEach(player => {
      this.cumulativeScores[player.id] = 0;
    });
  }

  startNewRound() {
    if (this.currentRound && !this.currentRound.isCompleted()) {
      throw new Error('Cannot start new round while current round is incomplete');
    }
    
    const Round = require('./round').default || require('./round').Round;
    this.currentRound = new Round(this.players);
    return this.currentRound;
  }

  addScore(playerId, score) {
    if (typeof score !== 'number') {
      throw new Error('Score must be a number');
    }
    
    if (!(playerId in this.cumulativeScores)) {
      throw new Error(`Player ${playerId} not found in game`);
    }
    
    // Add score to cumulative total for tracking
    this.cumulativeScores[playerId] += score;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getCumulativeScores() {
    return { ...this.cumulativeScores };
  }

  getPlayerScore(playerId) {
    return this.cumulativeScores[playerId] || 0;
  }

  completeCurrentRound() {
    if (!this.currentRound) {
      throw new Error('No current round to complete');
    }
    
    const roundScores = this.currentRound.completeRound(this);
    this.rounds.push(this.currentRound);
    this.currentRound = null;
    
    return roundScores;
  }

  getRoundHistory() {
    return [...this.rounds];
  }

  isGameCompleted() {
    return this.gameCompleted;
  }

  endGame() {
    this.gameCompleted = true;
    return this.getCumulativeScores();
  }
}

export default GameState;