<template>
  <div class="score-summary-card" :class="{ 'winner-card': isWinner }">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-4">
        <div class="rank-badge" :class="rankBadgeClass">
          {{ rank }}
        </div>
        <div>
          <h3 class="text-lg font-semibold" :class="{ 'text-yellow-800': isWinner }">
            {{ player.name }}
            <span v-if="isWinner" class="ml-2">🏆</span>
          </h3>
        </div>
      </div>
      <div class="score-display">
        <span class="text-2xl font-bold" :class="{ 'text-yellow-800': isWinner }">
          {{ player.totalScore }}
        </span>
        <span class="text-sm text-gray-600 ml-1">pts</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  isWinner: {
    type: Boolean,
    default: false
  }
})

const rankBadgeClass = computed(() => {
  if (props.rank === 1) return 'bg-yellow-500 text-white'
  if (props.rank === 2) return 'bg-gray-400 text-white'
  if (props.rank === 3) return 'bg-orange-600 text-white'
  return 'bg-gray-200 text-gray-700'
})
</script>

<style scoped>
.score-summary-card {
  @apply bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200;
}

.winner-card {
  @apply bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400 border-2 shadow-lg;
}

.rank-badge {
  @apply w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold;
}

.score-summary-card:hover {
  @apply shadow-lg transform scale-105;
}
</style>