<template>
  <div class="score-summary-card">
    <div class="player-info">
      <div class="rank-badge" :class="getRankClass(rank)">
        #{{ rank }}
      </div>
      <div class="player-details">
        <h3 class="player-name">{{ player.name }}</h3>
        <p class="total-score">{{ player.totalScore }} points</p>
      </div>
    </div>
    <div class="round-scores">
      <div class="round-scores-header">
        <span>Round Scores:</span>
      </div>
      <div class="scores-grid">
        <span 
          v-for="(score, index) in player.roundScores" 
          :key="index"
          class="round-score"
        >
          R{{ index + 1 }}: {{ score }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreSummaryCard',
  props: {
    player: {
      type: Object,
      required: true
    },
    rank: {
      type: Number,
      default: 1
    }
  },
  methods: {
    getRankClass(rank) {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      return 'rank-other'
    }
  }
}
</script>

<style scoped>
.score-summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.score-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.player-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rank-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
  margin-right: 1rem;
}

.rank-first {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-second {
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
}

.rank-third {
  background: linear-gradient(135deg, #CD7F32, #B8860B);
}

.rank-other {
  background: linear-gradient(135deg, #6c757d, #495057);
}

.player-details {
  flex: 1;
}

.player-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.total-score {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #007bff;
}

.round-scores {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.round-scores-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
}

.round-score {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-align: center;
  border: 1px solid #e9ecef;
}
</style>