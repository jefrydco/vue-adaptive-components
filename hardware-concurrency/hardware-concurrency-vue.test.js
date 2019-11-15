import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveHardwareConcurrency from './index.vue'

afterEach(() => {
  jest.resetModules()
})

describe('vue-adaptive-hardware-concurrency', () => {
  test('should return window.navigator.hardwareConcurrency', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props.hardwareConcurrency }}</template>'
      }
    })

    await localVue.nextTick()
    expect(
      wrapper.vm.initialHardwareConcurrency.numberOfLogicalProcessors
    ).toBe(window.navigator.hardwareConcurrency)
  })

  test('should return 4 for device of hardwareConcurrency = 4', async () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true
    })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default:
          '<template>{{ props.hardwareConcurrency.numberOfLogicalProcessors }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain(4)
  })

  test('should return 2 for device of hardwareConcurrency = 2', async () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true
    })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default:
          '<template>{{ props.hardwareConcurrency.numberOfLogicalProcessors }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain(2)
  })
})
