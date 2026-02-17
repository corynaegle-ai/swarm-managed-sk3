<template>
  <div class="score-card">
    <div class="score-card-header">
      <h3>Round {{ scoreStore.currentRound }} Scores</h3>
      <div class="round-info">
        <span>Hands: {{ scoreStore.gameConfig.handsPerRound }}</span>
      </div>
    </div>
    
    <div class="current-scores">
      <div 
        v-for="(score, playerId) in scoreStore.currentRoundScores" 
        :key="playerId"
        class="player-score"
      >
        <span class="player-name">{{ getPlayerName(playerId) }}</span>
        <span class="score">{{ score }}</span>
        <span class="avg-per-hand">
          ({{ (score / scoreStore.gameConfig.handsPerRound).toFixed(1) }}/hand)
        </span>
      </div>
    </div>
    
    <div class="score-actions">
      <button 
        @click="updateScore"
        class="btn-primary"
        :disabled="!canUpdateScores"
      >
        Update Scores
      </button>
      
      <button 
        @click="completeRound"
        class="btn-success"
        :disabled="!canCompleteRound"
      >
        Complete Round
      </button>
    </div>
    
    <div class="score-history" v-if="scoreStore.roundScores.length > 0">
      <h4>Round History</h4>
      <div class="history-table">
        <div class="history-header">
          <div>Round</div>
          <div>Hands</div>
          <div v-for="playerId in getAllPlayers()" :key="playerId">
            {{ getPlayerName(playerId) }}
          </div>
        </div>
        
        <div 
          v-for="round in scoreStore.roundScores" 
          :key="round.roundNumber"
          class="history-row"
        >
          <div>{{ round.roundNumber }}</div>
          <div>{{ round.handsPlayed }}</div>
          <div v-for="playerId in getAllPlayers()" :key="playerId">
            {{ round.playerScores[playerId] || 0 }}
          </div>
        </div>
        
        <div class="history-totals">
          <div><strong>Totals</strong></div>
          <div>{{ getTotalHands() }}</div>
          <div v-for="playerId in getAllPlayers()" :key="playerId">
            <strong>{{ scoreStore.getTotalScores()[playerId] || 0 }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import scoreStore from '../store/scoreStore.js';

export default {
  name: 'ScoreCard',
  data() {
    return {
      scoreStore
    };
  },
  
  computed: {
    canUpdateScores() {
      return Object.keys(this.scoreStore.currentRoundScores).length > 0;
    },
    
    canCompleteRound() {
      return Object.keys(this.scoreStore.currentRoundScores).length > 0;
    }
  },
  
  methods: {
    updateScore() {
      // Emit event for parent component to handle score input
      this.$emit('update-scores', {
        round: this.scoreStore.currentRound,
        scores: this.scoreStore.currentRoundScores
      });
    },
    
    completeRound() {
      this.scoreStore.completeRound();
      this.$emit('round-completed', {
        roundNumber: this.scoreStore.currentRound,
        scores: this.scoreStore.currentRoundScores
      });
    },
    
    getPlayerName(playerId) {
      // Default implementation - can be overridden by parent
      return `Player ${playerId}`;
    },
    
    getAllPlayers() {
      const players = new Set();
      
      // Add current round players
      Object.keys(this.scoreStore.currentRoundScores).forEach(id => players.add(id));
      
      // Add historical players
      this.scoreStore.roundScores.forEach(round => {
        Object.keys(round.playerScores).forEach(id => players.add(id));
      });
      
      return Array.from(players).sort();
    },
    
    getTotalHands() {
      return this.scoreStore.roundScores.reduce((total, round) => {
        return total + round.handsPlayed;
      }, 0);
    },
    
    // Method to handle round transitions with variable hand counts
    transitionToNextRound(nextHandCount) {
      this.scoreStore.nextRound(nextHandCount);
      this.$emit('round-transition', {
        fromRound: this.scoreStore.currentRound - 1,
        toRound: this.scoreStore.currentRound,
        handCount: nextHandCount
      });
    }
  },
  
  // Expose methods for external access
  expose: {
    updatePlayerScore: (playerId, score) => {
      scoreStore.updatePlayerScore(playerId, score);
    },
    
    initializeRound: (roundNumber, handCount) => {
      scoreStore.initializeRound(roundNumber, handCount);
    },
    
    getScoreHistory: () => {
      return scoreStore.getScoreHistory();
    },
    
    getTotalScores: () => {
      return scoreStore.getTotalScores();
    }
  }
};
</script>

<style scoped>
.score-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.score-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.score-card-header h3 {
  margin: 0;
  color: #333;
}

.round-info {
  color: #666;
  font-size: 14px;
}

.current-scores {
  margin-bottom: 20px;
}

.player-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.player-name {
  font-weight: 500;
  flex: 1;
}

.score {
  font-size: 18px;
  font-weight: bold;
  color: #2c5aa0;
  margin-right: 10px;
}

.avg-per-hand {
  color: #666;
  font-size: 12px;
}

.score-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.btn-primary, .btn-success {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-primary:disabled, .btn-success:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.score-history h4 {
  margin-bottom: 15px;
  color: #333;
}

.history-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.history-header, .history-row, .history-totals {
  display: grid;
  grid-template-columns: 60px 60px repeat(auto-fit, minmax(80px, 1fr));
  gap: 1px;
}

.history-header {
  background-color: #f8f9fa;
  font-weight: bold;
}

.history-header > div, .history-row > div, .history-totals > div {
  padding: 8px;
  text-align: center;
  background-color: white;
}

.history-totals {
  background-color: #e9ecef;
  font-weight: bold;
}

.history-totals > div {
  background-color: #e9ecef;
}
</style>