<template>
  <div class="game-board">
    <div class="game-board-header">
      <h2>Game Board</h2>
    </div>
    
    <!-- Round Progress Indicator Integration -->
    <RoundProgressIndicator
      :currentRound="gameStore.currentRound"
      :handsCount="gameStore.currentRound"
      :isGameplayActive="gameStore.isGameplayActive"
      @next-round="handleNextRound"
    />
    
    <div class="game-board-content">
      <div class="game-area">
        <p class="game-status">Game Status: {{ gameStore.isGameplayActive ? 'Active' : 'Inactive' }}</p>
        <p class="current-round-info">Current Round: {{ gameStore.currentRound }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/gameStore';
import RoundProgressIndicator from './RoundProgressIndicator.vue';

export default {
  name: 'GameBoard',
  components: {
    RoundProgressIndicator
  },
  setup() {
    const gameStore = useGameStore();
    
    return {
      gameStore
    };
  },
  methods: {
    handleNextRound() {
      try {
        if (this.gameStore.advanceToNextRound) {
          this.gameStore.advanceToNextRound();
        } else {
          console.warn('advanceToNextRound method not available on gameStore');
        }
      } catch (error) {
        console.error('Error advancing to next round:', error);
      }
    }
  }
};
</script>

<style scoped>
.game-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.game-board-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.game-board-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.game-board-content {
  margin-top: 20px;
}

.game-area {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  min-height: 200px;
}

.game-status,
.current-round-info {
  margin: 0 0 8px 0;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.game-status {
  color: #1976d2;
}

.current-round-info {
  color: #388e3c;
}
</style>