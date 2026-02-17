import { calculateStandardBidScore } from '../scoring/standardScoring';

export class Round {
  constructor(players) {
    this.players = players;
    this.bids = {};
    this.tricks = [];
    this.completed = false;
    this.scores = {};
  }

  setBid(playerId, bid) {
    this.bids[playerId] = bid;
  }

  addTrick(trick) {
    this.tricks.push(trick);
  }

  completeRound(gameState) {
    if (this.completed) {
      throw new Error('Round already completed');
    }

    // Calculate scores for each player using standard scoring
    this.players.forEach(player => {
      const bid = this.bids[player.id] || 0;
      const tricksWon = this.countTricksWon(player.id);
      
      // Use standard scoring calculation
      const score = calculateStandardBidScore(bid, tricksWon);
      this.scores[player.id] = score;
      
      // Pass calculated scores to game state for cumulative tracking
      gameState.addScore(player.id, score);
    });

    this.completed = true;
    return this.scores;
  }

  finishRound(gameState) {
    return this.completeRound(gameState);
  }

  countTricksWon(playerId) {
    return this.tricks.filter(trick => trick.winner === playerId).length;
  }

  getRoundScores() {
    return { ...this.scores };
  }

  isCompleted() {
    return this.completed;
  }
}

export default Round;