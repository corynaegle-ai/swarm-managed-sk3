import { mount } from '@vue/test-utils';
import RoundProgressIndicator from '@/components/RoundProgressIndicator.vue';

describe('RoundProgressIndicator', () => {
  it('renders next round button', () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: false
      }
    });
    
    const button = wrapper.find('.next-round-btn');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Next Round');
  });

  it('emits next-round event when button is clicked', async () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: false
      }
    });
    
    const button = wrapper.find('.next-round-btn');
    await button.trigger('click');
    
    expect(wrapper.emitted('next-round')).toBeTruthy();
    expect(wrapper.emitted('next-round').length).toBe(1);
  });

  it('disables button when isGameplayActive is true', () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: true
      }
    });
    
    const button = wrapper.find('.next-round-btn');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.classes()).toContain('disabled');
  });

  it('does not emit event when button is disabled', async () => {
    const wrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: true
      }
    });
    
    const button = wrapper.find('.next-round-btn');
    await button.trigger('click');
    
    expect(wrapper.emitted('next-round')).toBeFalsy();
  });

  it('shows proper visual states for button', () => {
    const enabledWrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: false
      }
    });
    
    const disabledWrapper = mount(RoundProgressIndicator, {
      props: {
        isGameplayActive: true
      }
    });
    
    const enabledButton = enabledWrapper.find('.next-round-btn');
    const disabledButton = disabledWrapper.find('.next-round-btn');
    
    expect(enabledButton.classes()).not.toContain('disabled');
    expect(disabledButton.classes()).toContain('disabled');
  });
});