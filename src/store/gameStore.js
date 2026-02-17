import { reactive } from 'vue'

// Game store for managing game state
const gameState = reactive({
  players: [],
  currentRound: 1,
  maxRounds: 10,
  scores: {},
  gameStarted: false,
  gameCompleted: false,
  statistics: {
    totalRoundsPlayed: 0,
    averageScores: {}
  }
})

const gameStore = {
  state: gameState,

  // Initialize players
  initializePlayers(playerNames) {
    this.state.players = playerNames
    this.state.scores = {}
    playerNames.forEach(name => {
      this.state.scores[name] = Array(this.state.maxRounds).fill(0)
    })
    this.state.gameStarted = true
  },

  // Update player score for current round
  updateScore(playerName, roundIndex, score) {
    if (this.state.scores[playerName] && roundIndex < this.state.maxRounds) {
      this.state.scores[playerName][roundIndex] = score
    }
  },

  // Calculate final cumulative scores for all players
  calculateFinalScores() {
    const finalScores = {}
    let winner = null
    let highestScore = -Infinity

    // Calculate cumulative scores
    this.state.players.forEach(player => {
      const playerScores = this.state.scores[player] || []
      const totalScore = playerScores.reduce((sum, score) => sum + (score || 0), 0)
      finalScores[player] = totalScore

      // Determine winner
      if (totalScore > highestScore) {
        highestScore = totalScore
        winner = player
      }
    })

    // Calculate statistics
    this.state.statistics.totalRoundsPlayed = this.state.currentRound - 1
    this.state.statistics.averageScores = {}
    
    Object.keys(finalScores).forEach(player => {
      const roundsPlayed = this.state.statistics.totalRoundsPlayed || 1
      this.state.statistics.averageScores[player] = finalScores[player] / roundsPlayed
    })

    return {
      scores: finalScores,
      winner: winner,
      statistics: this.state.statistics
    }
  },

  // Restart game and reset all state
  restartGame() {
    // Reset all game state to initial values
    this.state.players = []
    this.state.currentRound = 1
    this.state.scores = {}
    this.state.gameStarted = false
    this.state.gameCompleted = false
    this.state.statistics = {
      totalRoundsPlayed: 0,
      averageScores: {}
    }
  },

  // Move to next round
  nextRound() {
    if (this.state.currentRound < this.state.maxRounds) {
      this.state.currentRound++
    } else {
      this.state.gameCompleted = true
    }
  },

  // Get current round
  getCurrentRound() {
    return this.state.currentRound
  },

  // Check if game is completed
  isGameCompleted() {
    return this.state.gameCompleted
  }
}

export default gameStore
export { gameStore, gameState }