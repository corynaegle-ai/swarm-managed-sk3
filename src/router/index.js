import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GameView from '@/views/GameView.vue'
import FinalScoresView from '@/views/FinalScoresView.vue'
import FinalScoresView from '@/views/FinalScoresView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/game',
    name: 'Game',
    component: GameView
  },
  {
    path: '/final-scores',
    name: 'FinalScores',
    component: FinalScoresView
  },
  {
    path: '/final-scores',
    name: 'FinalScores',
    component: FinalScoresView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router