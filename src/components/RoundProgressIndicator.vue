<template>
  <div class="round-progress-indicator">
    <div class="round-info">
      <h3>Round Progress</h3>
      <!-- Progress content will be added here -->
    </div>
    
    <button 
      class="next-round-btn"
      :disabled="isGameplayActive"
      @click="handleNextRound"
      :class="{ 'disabled': isGameplayActive }"
    >
      Next Round
    </button>
  </div>
</template>

<script>
export default {
  name: 'RoundProgressIndicator',
  props: {
    isGameplayActive: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['next-round'],
  methods: {
    handleNextRound() {
      if (!this.isGameplayActive) {
        this.$emit('next-round');
      }
    }
  }
};
</script>

<style scoped>
.round-progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.round-info {
  margin-bottom: 20px;
  text-align: center;
}

.round-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.next-round-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 120px;
}

.next-round-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.next-round-btn:active:not(.disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.next-round-btn.disabled,
.next-round-btn:disabled {
  background: #cccccc;
  color: #666666;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.next-round-btn.disabled:hover,
.next-round-btn:disabled:hover {
  transform: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background: #cccccc;
}
</style>