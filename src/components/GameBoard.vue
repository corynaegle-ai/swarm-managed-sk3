<template>
  <div class="game-board">
    <div class="game-header">
      <h1>Game Board</h1>
    </div>
    
    <div class="game-content">
      <div class="main-game-area">
        <!-- Game content will be added here -->
        <p>Game board content goes here...</p>
      </div>
      
      <div class="game-sidebar">
        <RoundProgressIndicator 
          :isGameplayActive="isGameplayActive"
          @next-round="handleNextRound"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RoundProgressIndicator from './RoundProgressIndicator.vue';

export default {
  name: 'GameBoard',
  components: {
    RoundProgressIndicator
  },
  data() {
    return {
      isGameplayActive: false
    };
  },
  methods: {
    handleNextRound() {
      console.log('Next round requested');
      // Handle next round logic here
      this.isGameplayActive = true;
      
      // Simulate gameplay duration
      setTimeout(() => {
        this.isGameplayActive = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
}

.game-header {
  background: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-header h1 {
  margin: 0;
  font-size: 2em;
}

.game-content {
  display: flex;
  flex: 1;
  gap: 20px;
  padding: 20px;
}

.main-game-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  .game-content {
    flex-direction: column;
  }
  
  .game-sidebar {
    width: 100%;
  }
}
</style>