<template>
  <div class="round-progress-indicator">
    <div class="progress-header">
      <h3 class="round-title">Round {{ currentRound }}</h3>
      <div class="hands-info">
        <span class="hands-count">{{ handsCount }} hands</span>
      </div>
    </div>
    
    <div class="progress-actions">
      <button 
        class="next-round-btn"
        :disabled="!isGameplayActive"
        @click="handleNextRound"
      >
        Next Round
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundProgressIndicator',
  props: {
    currentRound: {
      type: Number,
      default: 1
    },
    handsCount: {
      type: Number,
      default: 1
    },
    isGameplayActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleNextRound() {
      this.$emit('next-round');
    }
  }
};
</script>

<style scoped>
.round-progress-indicator {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.round-title {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.hands-info {
  color: #666;
  font-size: 0.9em;
}

.hands-count {
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.progress-actions {
  display: flex;
  justify-content: flex-end;
}

.next-round-btn {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.next-round-btn:hover:not(:disabled) {
  background: #1565c0;
}

.next-round-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>