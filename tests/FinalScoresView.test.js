import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import FinalScoresView from '@/views/FinalScoresView.vue'
import { useGameStore } from '@/store/gameStore'

// Mock the game store
vi.mock('@/store/gameStore')

// Mock ScoreSummaryCard component
vi.mock('@/components/ScoreSummaryCard.vue', () => {
  return {
    default: {
      name: 'ScoreSummaryCard',
      props: ['player', 'rank', 'isWinner'],
      template: '<div class="mock-score-card">{{ player.name }}: {{ player.totalScore }}</div>'
    }
  }
})

describe('FinalScoresView', () => {
  let mockGameStore
  let router

  beforeEach(() => {
    mockGameStore = {
      players: [
        { name: 'Player 1', totalScore: 150 },
        { name: 'Player 2', totalScore: 120 },
        { name: 'Player 3', totalScore: 180 }
      ],
      winner: { name: 'Player 3', totalScore: 180 },
      restartGame: vi.fn()
    }

    useGameStore.mockReturnValue(mockGameStore)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/final-scores', component: FinalScoresView }
      ]
    })
  })

  it('displays winner announcement', async () => {
    const wrapper = mount(FinalScoresView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Game Complete!')
    expect(wrapper.text()).toContain('Winner')
    expect(wrapper.text()).toContain('Player 3')
    expect(wrapper.text()).toContain('180 points')
  })

  it('displays all players using ScoreSummaryCard components', async () => {
    const wrapper = mount(FinalScoresView, {
      global: {
        plugins: [router]
      }
    })

    const scoreCards = wrapper.findAllComponents({ name: 'ScoreSummaryCard' })
    expect(scoreCards).toHaveLength(3)
    
    // Check that players are ranked by score (highest first)
    expect(scoreCards[0].props('player').name).toBe('Player 3')
    expect(scoreCards[0].props('rank')).toBe(1)
    expect(scoreCards[0].props('isWinner')).toBe(true)
    
    expect(scoreCards[1].props('player').name).toBe('Player 1')
    expect(scoreCards[1].props('rank')).toBe(2)
    expect(scoreCards[1].props('isWinner')).toBe(false)
  })

  it('handles restart game correctly', async () => {
    const wrapper = mount(FinalScoresView, {
      global: {
        plugins: [router]
      }
    })

    const restartButton = wrapper.find('button')
    expect(restartButton.text()).toContain('Start New Game')
    
    await restartButton.trigger('click')
    
    expect(mockGameStore.restartGame).toHaveBeenCalled()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('handles empty winner gracefully', async () => {
    mockGameStore.winner = { name: 'Unknown', totalScore: 0 }
    
    const wrapper = mount(FinalScoresView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Unknown')
    expect(wrapper.text()).toContain('0 points')
  })
})