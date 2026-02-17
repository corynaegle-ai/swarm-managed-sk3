<template>
  <div class="game-view">
    <!-- Game completion check and auto-navigation -->
    <div v-if="gameStore.isGameComplete">
      <!-- This will trigger navigation in mounted hook -->
    </div>
    
    <!-- Regular game content would go here -->
    <div v-else>
      <h2>Game in Progress</h2>
      <p>Round: {{ gameStore.currentRound }} / {{ gameStore.maxRounds }}</p>
      
      <div class="game-controls">
        <button @click="nextRound" class="btn-primary">
          {{ gameStore.currentRound < gameStore.maxRounds ? 'Next Round' : 'Complete Game' }}
        </button>
      </div>
      
      <div class="game-info">
        <p>Click "Next Round" to progress through the game.</p>
        <p>After round {{ gameStore.maxRounds }}, you'll be taken to the final scores.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'

export default {
  name: 'GameView',
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    // Watch for game completion and navigate to final scores
    watch(
      () => gameStore.isGameComplete,
      (isComplete) => {
        if (isComplete) {
          router.push('/final-scores')
        }
      }
    )

    // Also check on mount in case already complete
    onMounted(() => {
      if (gameStore.isGameComplete) {
        router.push('/final-scores')
      }
    })

    const nextRound = () => {
      if (gameStore.currentRound < gameStore.maxRounds) {
        gameStore.currentRound++
      } else {
        // Mark game as complete
        gameStore.currentRound = gameStore.maxRounds
        // The watch will handle navigation
      }
    }

    return {
      gameStore,
      nextRound
    }
  }
}
</script>

<style scoped>
.game-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.game-controls {
  margin: 2rem 0;
}

.btn-primary {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #45a049;
}

.game-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.game-info p {
  margin: 0.5rem 0;
}
</style>