<template>
  <div class="game-board">
    <div class="game-header">
      <h1>Game Board</h1>
      <RoundProgressIndicator 
        :currentRound="currentRound"
        :totalRounds="totalRounds"
      />
    </div>
    
    <div class="game-content">
      <div class="round-controls">
        <button 
          @click="previousRound" 
          :disabled="currentRound <= 1"
          class="btn btn-secondary"
        >
          Previous Round
        </button>
        <button 
          @click="nextRound" 
          :disabled="currentRound >= totalRounds"
          class="btn btn-primary"
        >
          Next Round
        </button>
      </div>
      
      <div class="game-area">
        <p>Current Round: {{ currentRound }}</p>
        <p>Game content goes here...</p>
      </div>
    </div>
  </div>
</template>

<script>
import RoundProgressIndicator from './RoundProgressIndicator.vue'

export default {
  name: 'GameBoard',
  components: {
    RoundProgressIndicator
  },
  data() {
    return {
      currentRound: 1,
      totalRounds: 10
    }
  },
  methods: {
    nextRound() {
      if (this.currentRound < this.totalRounds) {
        this.currentRound++
      }
    },
    previousRound() {
      if (this.currentRound > 1) {
        this.currentRound--
      }
    }
  }
}
</script>

<style scoped>
.game-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.game-header {
  margin-bottom: 2rem;
}

.game-header h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.game-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.round-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.game-area {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}
</style>