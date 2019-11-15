import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveMemory from './index.vue'

afterEach(() => {
  jest.resetModules()
})

const getMemoryStatus = currentResult => ({
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

  test('should return mockMemory status', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
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
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })
    expect(wrapper.vm.initialMemoryStatus).toEqual(mockMemoryStatus)
  })
})
