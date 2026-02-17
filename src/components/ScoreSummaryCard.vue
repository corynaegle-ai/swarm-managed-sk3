<template>
  <div class="score-summary-card" :class="{ 'winner-card': rank === 1 }">
    <div class="rank-badge">
      <span class="rank-number">{{ rankDisplay }}</span>
    </div>
    
    <div class="player-info">
      <h3 class="player-name">{{ player.name }}</h3>
      <div class="score-details">
        <div class="total-score">
          <span class="score-label">Total Score</span>
          <span class="score-value">{{ player.totalScore }}</span>
        </div>
        <div class="average-score">
          <span class="score-label">Average per Round</span>
          <span class="score-value">{{ averageScore }}</span>
        </div>
      </div>
    </div>

    <div class="medal" v-if="rank <= 3">
      {{ getMedal(rank) }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ScoreSummaryCard',
  props: {
    player: {
      type: Object,
      required: true
    },
    rank: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const rankDisplay = computed(() => {
      const suffixes = ['th', 'st', 'nd', 'rd']
      const remainder = props.rank % 100
      const suffix = (remainder >= 11 && remainder <= 13) 
        ? 'th' 
        : suffixes[props.rank % 10] || 'th'
      return `${props.rank}${suffix}`
    })

    const averageScore = computed(() => {
      if (!props.player.roundScores || props.player.roundScores.length === 0) {
        return '0.0'
      }
      const average = props.player.totalScore / props.player.roundScores.length
      return average.toFixed(1)
    })

    const getMedal = (rank) => {
      const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
      return medals[rank] || ''
    }

    return {
      rankDisplay,
      averageScore,
      getMedal
    }
  }
}
</script>

<style scoped>
.score-summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
}

.score-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.winner-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  border-color: #f59e0b;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.winner-card .rank-badge {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.rank-number {
  line-height: 1;
}

.player-info {
  flex: 1;
  text-align: left;
}

.player-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.winner-card .player-name {
  color: #92400e;
}

.score-details {
  display: flex;
  gap: 2rem;
}

.total-score,
.average-score {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.score-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.score-value {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
}

.winner-card .score-value {
  color: #92400e;
}

.medal {
  font-size: 2rem;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .score-summary-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .player-info {
    text-align: center;
  }
  
  .score-details {
    justify-content: center;
    gap: 1.5rem;
  }
}
</style>