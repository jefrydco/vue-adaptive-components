import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveNetwork from './index.vue'

describe('vue-adaptive-network', () => {
  test('should return 4g of effectiveConnectionType', async () => {
    global.navigator.connection = {
      effectiveType: '4g',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })
    await localVue.nextTick()
    expect(wrapper.html()).toContain('4g')
  })

  test('should update the effectiveConnectionType state', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })
    wrapper.setData({ networkStatus: { effectiveConnectionType: '2g' } })
    await localVue.nextTick()

    expect(wrapper.html()).toContain('2g')
  })

  test('should update the effectiveConnectionType state when navigator.connection change event', async () => {
    const map = {}

    global.navigator.connection = {
      effectiveType: '2g',
      addEventListener: jest.fn().mockImplementation((event, callback) => {
        map[event] = callback
      }),
      removeEventListener: jest.fn()
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick(() => {
      global.navigator.connection.effectiveType = '4g'
      map.change()
    })
    await localVue.nextTick()

    expect(wrapper.html()).toContain('4g')
  })
})
