import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // State
  const players = ref([])
  const currentRound = ref(1)
  const maxRounds = ref(10)
  const gameStarted = ref(false)
  const gameCompleted = ref(false)
  const currentPlayerIndex = ref(0)

  // Getters
  const currentPlayer = computed(() => {
    return players.value[currentPlayerIndex.value] || null
  })

  const isGameComplete = computed(() => {
    return currentRound.value > maxRounds.value
  })

  const winner = computed(() => {
    if (!isGameComplete.value || players.value.length === 0) {
      return null
    }
    return players.value.reduce((winner, player) => {
      return player.totalScore > winner.totalScore ? player : winner
    })
  })

  // Actions
  const initializePlayers = (playerNames) => {
    players.value = playerNames.map((name, index) => ({
      id: index + 1,
      name: name,
      totalScore: 0,
      roundScores: []
    }))
    gameStarted.value = true
    currentRound.value = 1
    currentPlayerIndex.value = 0
    gameCompleted.value = false
  }

  const addScore = (playerId, score) => {
    const player = players.value.find(p => p.id === playerId)
    if (player) {
      player.roundScores.push(score)
      player.totalScore += score
    }
  }

  const nextPlayer = () => {
    if (currentPlayerIndex.value < players.value.length - 1) {
      currentPlayerIndex.value++
    } else {
      nextRound()
    }
  }

  const nextRound = () => {
    if (currentRound.value < maxRounds.value) {
      currentRound.value++
      currentPlayerIndex.value = 0
    } else {
      gameCompleted.value = true
    }
  }

  const restartGame = () => {
    players.value = []
    currentRound.value = 1
    gameStarted.value = false
    gameCompleted.value = false
    currentPlayerIndex.value = 0
  }

  const getPlayerScore = (playerId) => {
    const player = players.value.find(p => p.id === playerId)
    return player ? player.totalScore : 0
  }

  const getPlayerRoundScores = (playerId) => {
    const player = players.value.find(p => p.id === playerId)
    return player ? player.roundScores : []
  }

  return {
    // State
    players,
    currentRound,
    maxRounds,
    gameStarted,
    gameCompleted,
    currentPlayerIndex,
    
    // Getters
    currentPlayer,
    isGameComplete,
    winner,
    
    // Actions
    initializePlayers,
    addScore,
    nextPlayer,
    nextRound,
    restartGame,
    getPlayerScore,
    getPlayerRoundScores
  }
})