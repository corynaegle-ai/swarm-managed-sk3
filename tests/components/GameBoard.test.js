import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import GameBoard from '../../src/components/GameBoard.vue';
import { useGameStore } from '../../src/stores/gameStore';

describe('GameBoard.vue', () => {
  let pinia;
  
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });
  
  it('renders RoundProgressIndicator with correct props', () => {
    const wrapper = mount(GameBoard, {
      global: {
        plugins: [pinia]
      }
    });
    
    const progressIndicator = wrapper.findComponent({ name: 'RoundProgressIndicator' });
    expect(progressIndicator.exists()).toBe(true);
  });
  
  it('calls gameStore.advanceToNextRound when next-round event is emitted', async () => {
    const wrapper = mount(GameBoard, {
      global: {
        plugins: [pinia]
      }
    });
    
    const gameStore = useGameStore();
    gameStore.advanceToNextRound = jest.fn();
    
    const progressIndicator = wrapper.findComponent({ name: 'RoundProgressIndicator' });
    await progressIndicator.vm.$emit('next-round');
    
    expect(gameStore.advanceToNextRound).toHaveBeenCalled();
  });
});