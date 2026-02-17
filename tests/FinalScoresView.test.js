import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FinalScoresView from '@/views/FinalScoresView.vue'
import { useGameStore } from '@/store/gameStore'
import { createRouter, createWebHistory } from 'vue-router'

const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

describe('FinalScoresView', () => {
  let wrapper
  let gameStore

  beforeEach(() => {
    setActivePinia(createPinia())
    gameStore = useGameStore()
    
    // Setup mock players
    gameStore.initializePlayers(['Alice', 'Bob', 'Charlie'])
    gameStore.addScore(1, 100)
    gameStore.addScore(2, 80)
    gameStore.addScore(3, 90)
    
    wrapper = mount(FinalScoresView, {
      global: {
        plugins: [router]
      }
    })
  })

  it('displays winner announcement', () => {
    expect(wrapper.find('.winner-title').text()).toContain('Game Complete!')
    expect(wrapper.find('.winner-name').text()).toContain('Wins!')
  })

  it('shows all players with ScoreSummaryCard components', () => {
    const scoreCards = wrapper.findAllComponents({ name: 'ScoreSummaryCard' })
    expect(scoreCards).toHaveLength(3)
  })

  it('displays players in ranked order', () => {
    const scoreCards = wrapper.findAllComponents({ name: 'ScoreSummaryCard' })
    expect(scoreCards[0].props('rank')).toBe(1)
    expect(scoreCards[1].props('rank')).toBe(2)
    expect(scoreCards[2].props('rank')).toBe(3)
  })

  it('includes restart game button', () => {
    const restartButton = wrapper.find('.restart-button')
    expect(restartButton.exists()).toBe(true)
    expect(restartButton.text()).toContain('Play Again')
  })

  it('calls restartGame and navigates home when restart button clicked', async () => {
    const restartSpy = vi.spyOn(gameStore, 'restartGame')
    const restartButton = wrapper.find('.restart-button')
    
    await restartButton.trigger('click')
    
    expect(restartSpy).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })
})