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
      <!-- Add your game logic here -->
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

    return {
      gameStore
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
</style>