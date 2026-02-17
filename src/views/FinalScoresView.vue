<template>
  <div class="final-scores-view">
    <div class="winner-section">
      <h1 class="winner-title">🎉 Game Complete! 🎉</h1>
      <h2 class="winner-name">{{ winner.name }} Wins!</h2>
      <p class="winner-score">Final Score: {{ winner.score }}</p>
    </div>

    <div class="scores-section">
      <h3>Final Rankings</h3>
      <div class="scores-grid">
        <ScoreSummaryCard
          v-for="(player, index) in rankedPlayers"
          :key="player.id"
          :player="player"
          :rank="index + 1"
        />
      </div>
    </div>

    <div class="actions-section">
      <button 
        class="restart-button"
        @click="handleRestartGame"
      >
        🎲 Play Again
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGameStore } from '@/store/gameStore'
import ScoreSummaryCard from '@/components/ScoreSummaryCard.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FinalScoresView',
  components: {
    ScoreSummaryCard
  },
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    const rankedPlayers = computed(() => {
      return [...gameStore.players]
        .sort((a, b) => b.totalScore - a.totalScore)
    })

    const winner = computed(() => {
      return rankedPlayers.value[0] || { name: 'Unknown', score: 0 }
    })

    const handleRestartGame = () => {
      gameStore.restartGame()
      router.push('/')
    }

    return {
      rankedPlayers,
      winner,
      handleRestartGame
    }
  }
}
</script>

<style scoped>
.final-scores-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.winner-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.winner-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.winner-name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #ffd700;
}

.winner-score {
  font-size: 1.2rem;
  opacity: 0.9;
}

.scores-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.scores-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.actions-section {
  margin-top: 2rem;
}

.restart-button {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.restart-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.restart-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .final-scores-view {
    padding: 1rem;
  }
  
  .winner-title {
    font-size: 2rem;
  }
  
  .winner-name {
    font-size: 1.5rem;
  }
}
</style>