<template>
  <div class="final-scores-view">
    <!-- Winner Announcement Section -->
    <div class="winner-section">
      <h1 class="winner-title">🎉 Game Complete! 🎉</h1>
      <div v-if="gameWinner" class="winner-announcement">
        <h2 class="winner-name">{{ gameWinner.name }} Wins!</h2>
        <p class="winner-score">Final Score: {{ gameWinner.totalScore }}</p>
      </div>
      <div v-else class="no-winner">
        <h2>Game Complete</h2>
        <p>No winner determined</p>
      </div>
    </div>

    <!-- All Player Scores -->
    <div class="scores-section">
      <h3>Final Scores</h3>
      <div class="player-scores">
        <ScoreSummaryCard
          v-for="player in sortedPlayers"
          :key="player.id"
          :player="player"
          :rank="getRank(player)"
        />
      </div>
    </div>

    <!-- Restart Game Button -->
    <div class="actions-section">
      <button 
        @click="handleRestartGame" 
        class="restart-btn"
      >
        Start New Game
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import ScoreSummaryCard from '@/components/ScoreSummaryCard.vue'

export default {
  name: 'FinalScoresView',
  components: {
    ScoreSummaryCard
  },
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    // Use the store's winner computed property
    const gameWinner = computed(() => gameStore.winner)
    
    // Sort players by total score (descending)
    const sortedPlayers = computed(() => {
      return [...gameStore.players].sort((a, b) => b.totalScore - a.totalScore)
    })

    // Get player rank based on sorted position
    const getRank = (player) => {
      return sortedPlayers.value.findIndex(p => p.id === player.id) + 1
    }

    const handleRestartGame = () => {
      gameStore.restartGame()
      router.push('/')
    }

    // Navigation guard - redirect if game not complete
    onMounted(() => {
      if (!gameStore.isGameComplete) {
        router.push('/game')
      }
    })

    return {
      gameWinner,
      sortedPlayers,
      getRank,
      handleRestartGame
    }
  }
}
</script>

<style scoped>
.final-scores-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.winner-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.winner-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.winner-name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.winner-score {
  font-size: 1.5rem;
  opacity: 0.9;
}

.scores-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.player-scores {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.actions-section {
  text-align: center;
}

.restart-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.restart-btn:hover {
  background: #218838;
}

.no-winner {
  opacity: 0.8;
}
</style>