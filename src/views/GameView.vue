<template>
  <div class="game-view">
    <div class="container mx-auto p-6">
      <!-- Game Header -->
      <div class="game-header mb-6">
        <h1 class="text-3xl font-bold text-center mb-4">Sketch It!</h1>
        <div class="flex justify-between items-center bg-white rounded-lg p-4 shadow">
          <div class="text-lg font-semibold">
            Round {{ currentRound }} of {{ totalRounds }}
          </div>
          <div class="text-lg font-semibold text-blue-600">
            Current Player: {{ currentPlayer?.name || 'Loading...' }}
          </div>
        </div>
      </div>

      <!-- Game Content -->
      <div class="game-content">
        <component
          :is="currentPhaseComponent"
          :key="gamePhaseKey"
          @phase-complete="handlePhaseComplete"
        />
      </div>

      <!-- Debug Info (remove in production) -->
      <div v-if="isDev" class="debug-info mt-8 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Debug Info:</h3>
        <p>Phase: {{ currentPhase }}</p>
        <p>Round: {{ currentRound }}</p>
        <p>Player: {{ currentPlayer?.name }}</p>
        <p>Game State: {{ gameState }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import DrawingPhase from '@/components/DrawingPhase.vue'
import GuessingPhase from '@/components/GuessingPhase.vue'
import RoundResults from '@/components/RoundResults.vue'

const router = useRouter()
const gameStore = useGameStore()

// Computed properties
const currentPhase = computed(() => gameStore.currentPhase)
const currentRound = computed(() => gameStore.currentRound)
const totalRounds = computed(() => gameStore.totalRounds)
const currentPlayer = computed(() => gameStore.currentPlayer)
const gameState = computed(() => gameStore.gameState)

// Development flag
const isDev = computed(() => import.meta.env.DEV)

// Component mapping
const currentPhaseComponent = computed(() => {
  switch (currentPhase.value) {
    case 'drawing':
      return DrawingPhase
    case 'guessing':
      return GuessingPhase
    case 'results':
      return RoundResults
    default:
      return DrawingPhase
  }
})

// Key to force re-render when phase changes
const gamePhaseKey = computed(() => {
  return `${currentPhase.value}-${currentRound.value}-${currentPlayer.value?.name || 'none'}`
})

// Handle phase completion
const handlePhaseComplete = (data) => {
  gameStore.completePhase(data)
}

// Watch for game completion and navigate to final scores
watch(
  () => gameStore.gameState,
  (newState) => {
    if (newState === 'completed') {
      router.push('/final-scores')
    }
  }
)

// Initialize game if not already started
if (gameStore.gameState === 'setup') {
  // Redirect to home if no players are set up
  if (gameStore.players.length === 0) {
    router.push('/')
  } else {
    gameStore.startGame()
  }
}
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
}

.game-header {
  animation: fadeInDown 0.6s ease-out;
}

.game-content {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>