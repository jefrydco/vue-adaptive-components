import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveMemory from './index.vue'

afterEach(() => {
  jest.resetModules()
})

const getMemoryStatus = currentResult => ({
  unsupported: false,
  deviceMemory: currentResult.deviceMemory,
  totalJSHeapSize: currentResult.totalJSHeapSize,
  usedJSHeapSize: currentResult.usedJSHeapSize,
  jsHeapSizeLimit: currentResult.jsHeapSizeLimit
})

describe('vue-adaptive-memory', () => {
  test('should return "true" for unsupported case', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveMemory, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toEqual(true)
  })

  test('should return initialMemoryStatus for unsupported case', async () => {
    const mockInitialMemoryStatus = {
      deviceMemory: 4
    }

    const { deviceMemory } = mockInitialMemoryStatus

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveMemory, {
      localVue,
      propsData: {
        initialMemoryStatus: mockInitialMemoryStatus
      },
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
    expect(wrapper.vm.initialMemoryStatus.deviceMemory).toEqual(deviceMemory)
  })

  test('should return mockMemory status', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    }

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory

    global.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveMemory, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(getMemoryStatus(wrapper.vm.memoryStatus)).toEqual({
      ...mockMemoryStatus,
      unsupported: false
    })
  })

  test('should return mockMemory status without performance memory data', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4
    }

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory
    delete global.window.performance.memory

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveMemory, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.memoryStatus.deviceMemory).toBe(
      mockMemoryStatus.deviceMemory
    )
    expect(wrapper.vm.unsupported).toBe(false)
  })

  test('should not return initialMemoryStatus for supported case', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    }

    const mockInitialMemoryStatus = {
      deviceMemory: 4
    }

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory

    global.window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveMemory, {
      localVue,
      propsData: {
        initialMemoryStatus: mockInitialMemoryStatus
      },
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(getMemoryStatus(wrapper.vm.memoryStatus)).toEqual({
      ...mockMemoryStatus,
      unsupported: false
    })
  })
})
