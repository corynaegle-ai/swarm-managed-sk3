import { mount } from '@vue/test-utils'
import RoundProgressIndicator from '@/components/RoundProgressIndicator.vue'

describe('RoundProgressIndicator', () => {
  it('renders current round correctly', () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        currentRound: 3,
        totalRounds: 10
      }
    })
    
    expect(wrapper.text()).toContain('Round 3')
  })
  
  it('calculates progress percentage correctly', () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        currentRound: 5,
        totalRounds: 10
      }
    })
    
    expect(wrapper.vm.progressPercentage).toBe(50)
  })
  
  it('triggers transition state when round changes', async () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        currentRound: 1,
        totalRounds: 10
      }
    })
    
    await wrapper.setProps({ currentRound: 2 })
    
    expect(wrapper.vm.isTransitioning).toBe(true)
  })
  
  it('has transition elements with correct classes', () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        currentRound: 1,
        totalRounds: 10
      }
    })
    
    const transition = wrapper.find('.round-counter-wrapper')
    expect(transition.exists()).toBe(true)
  })
})