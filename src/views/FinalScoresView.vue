<template>
  <div class="final-scores-view">
    <div class="container mx-auto p-6">
      <!-- Winner Announcement Section -->
      <div class="winner-section mb-8 text-center">
        <h1 class="text-4xl font-bold text-green-600 mb-4">🎉 Game Complete! 🎉</h1>
        <div class="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
          <h2 class="text-2xl font-semibold mb-2">🏆 Winner</h2>
          <p class="text-xl font-bold text-green-700">{{ winner.name }}</p>
          <p class="text-lg text-gray-600">Final Score: {{ winner.totalScore }} points</p>
        </div>
      </div>

      <!-- All Player Scores Section -->
      <div class="scores-section mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-center">Final Rankings</h2>
        <div class="grid gap-4">
          <ScoreSummaryCard
            v-for="(player, index) in rankedPlayers"
            :key="player.name"
            :player="player"
            :rank="index + 1"
            :isWinner="index === 0"
          />
        </div>
      </div>

      <!-- Restart Game Button -->
      <div class="text-center">
        <button
          @click="handleRestartGame"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          🎮 Start New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import ScoreSummaryCard from '@/components/ScoreSummaryCard.vue'

const router = useRouter()
const gameStore = useGameStore()

// Use the store's winner computed property
const winner = computed(() => gameStore.winner)

// Get all players ranked by total score
const rankedPlayers = computed(() => {
  return [...gameStore.players].sort((a, b) => b.totalScore - a.totalScore)
})

// Handle restart game
const handleRestartGame = () => {
  gameStore.restartGame()
  router.push('/')
}
</script>

<style scoped>
.final-scores-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
}

.winner-section {
  animation: fadeInUp 0.8s ease-out;
}

.scores-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>