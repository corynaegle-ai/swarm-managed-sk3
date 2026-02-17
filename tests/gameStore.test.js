import { describe, it, expect, beforeEach } from 'vitest'
import gameStore from '../src/store/gameStore.js'

describe('gameStore', () => {
  beforeEach(() => {
    gameStore.restartGame()
  })

  describe('calculateFinalScores', () => {
    it('should calculate cumulative scores for all players', () => {
      gameStore.initializePlayers(['Alice', 'Bob'])
      gameStore.updateScore('Alice', 0, 10)
      gameStore.updateScore('Alice', 1, 15)
      gameStore.updateScore('Bob', 0, 8)
      gameStore.updateScore('Bob', 1, 12)

      const result = gameStore.calculateFinalScores()

      expect(result.scores.Alice).toBe(25)
      expect(result.scores.Bob).toBe(20)
    })

    it('should correctly identify the winner', () => {
      gameStore.initializePlayers(['Alice', 'Bob', 'Charlie'])
      gameStore.updateScore('Alice', 0, 10)
      gameStore.updateScore('Bob', 0, 15)
      gameStore.updateScore('Charlie', 0, 8)

      const result = gameStore.calculateFinalScores()

      expect(result.winner).toBe('Bob')
    })

    it('should calculate game statistics', () => {
      gameStore.initializePlayers(['Alice', 'Bob'])
      gameStore.updateScore('Alice', 0, 20)
      gameStore.updateScore('Bob', 0, 10)
      gameStore.nextRound()

      const result = gameStore.calculateFinalScores()

      expect(result.statistics.totalRoundsPlayed).toBe(1)
      expect(result.statistics.averageScores.Alice).toBe(20)
      expect(result.statistics.averageScores.Bob).toBe(10)
    })
  })

  describe('restartGame', () => {
    it('should reset all game state to initial values', () => {
      gameStore.initializePlayers(['Alice', 'Bob'])
      gameStore.updateScore('Alice', 0, 10)
      gameStore.nextRound()

      gameStore.restartGame()

      expect(gameStore.state.players).toEqual([])
      expect(gameStore.state.currentRound).toBe(1)
      expect(gameStore.state.scores).toEqual({})
      expect(gameStore.state.gameStarted).toBe(false)
      expect(gameStore.state.gameCompleted).toBe(false)
      expect(gameStore.state.statistics.totalRoundsPlayed).toBe(0)
      expect(gameStore.state.statistics.averageScores).toEqual({})
    })
  })
})