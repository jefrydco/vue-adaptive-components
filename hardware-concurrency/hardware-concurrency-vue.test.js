import { mount, createLocalVue } from '@vue/test-utils'

afterEach(() => {
  jest.resetModules()
})

describe('vue-adaptive-hardware-concurrency', () => {
  test('should return global.navigator.hardwareConcurrency', async () => {
    const { default: VueAdaptiveHardwareConcurrency } = require('./index.vue')

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.numberOfLogicalProcessors).toBe(
      global.navigator.hardwareConcurrency
    )
  })

  test('should return 4 for device of hardwareConcurrency = 4', async () => {
    const { default: VueAdaptiveHardwareConcurrency } = require('./index.vue')

    Object.defineProperty(global.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true
    })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props.numberOfLogicalProcessors }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain(4)
  })

  test('should return 2 for device of hardwareConcurrency = 2', async () => {
    const { default: VueAdaptiveHardwareConcurrency } = require('./index.vue')

    Object.defineProperty(global.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true
    })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props.numberOfLogicalProcessors }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain(2)
  })
})
