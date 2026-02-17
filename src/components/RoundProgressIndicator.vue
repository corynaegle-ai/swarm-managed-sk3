<template>
  <div class="round-progress-indicator">
    <div class="round-counter-wrapper">
      <transition name="round-change" mode="out-in">
        <div 
          :key="currentRound" 
          class="round-counter"
          :class="{ 'loading': isTransitioning }"
        >
          Round {{ currentRound }}
        </div>
      </transition>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundProgressIndicator',
  props: {
    currentRound: {
      type: Number,
      required: true,
      default: 1
    },
    totalRounds: {
      type: Number,
      required: true,
      default: 10
    }
  },
  data() {
    return {
      isTransitioning: false
    }
  },
  computed: {
    progressPercentage() {
      return (this.currentRound / this.totalRounds) * 100
    }
  },
  watch: {
    currentRound(newRound, oldRound) {
      if (newRound !== oldRound) {
        this.isTransitioning = true
        setTimeout(() => {
          this.isTransitioning = false
        }, 300)
      }
    }
  }
}
</script>

<style scoped>
.round-progress-indicator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.round-counter-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2.5rem;
}

.round-counter {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 0.5rem 1rem;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.round-counter.loading {
  opacity: 0.7;
}

/* Round change transition animations */
.round-change-enter-active,
.round-change-leave-active {
  transition: all 300ms ease-in-out;
}

.round-change-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.round-change-leave-to {
  opacity: 0;
  transform: scale(1.2) translateY(10px);
}

.round-change-enter-to,
.round-change-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease-in-out;
  border-radius: 4px;
}

/* Additional loading state animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.round-counter.loading {
  animation: pulse 1s infinite;
}
</style>