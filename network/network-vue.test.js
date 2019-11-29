import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveNetwork from './index.vue'

describe('vue-adaptive-network', () => {
  const map = {}

  const ectStatusListener = {
    addEventListener: jest.fn().mockImplementation((event, callback) => {
      map[event] = callback
    }),
    removeEventListener: jest.fn()
  }

  afterEach(() => {
    Object.values(ectStatusListener).forEach(listener => listener.mockClear())
  })

  const testEctStatusEventListenerMethod = method => {
    expect(method).toBeCalledTimes(1)
    expect(method.mock.calls[0][0]).toEqual('change')
    expect(method.mock.calls[0][1].constructor).toEqual(Function)
  }

  test('should return "true" for unsupported case', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
  })

  test('should return initialEffectiveConnectionType for unsupported case', async () => {
    const initialEffectiveConnectionType = '4g'

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      propsData: {
        initialEffectiveConnectionType: initialEffectiveConnectionType
      },
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
    expect(wrapper.vm.effectiveConnectionType).toBe(
      initialEffectiveConnectionType
    )
  })

  test('should return 4g of effectiveConnectionType', async () => {
    global.navigator.connection = {
      ...ectStatusListener,
      effectiveType: '4g'
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.effectiveConnectionType).toEqual('4g')
  })

  test('should not return initialEffectiveConnectionType for supported case', async () => {
    const initialEffectiveConnectionType = '2g'

    global.navigator.connection = {
      ...ectStatusListener,
      effectiveType: '4g'
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      propsData: {
        initialEffectiveConnectionType: initialEffectiveConnectionType
      }
    })

    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.effectiveConnectionType).toEqual('4g')
  })

  test('should update the effectiveConnectionType state', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })
    wrapper.setData({ effectiveConnectionType: '2g' })
    await localVue.nextTick()

    expect(wrapper.vm.effectiveConnectionType).toBe('2g')
  })

  test('should update the effectiveConnectionType state when navigator.connection change event', async () => {
    global.navigator.connection = {
      ...ectStatusListener,
      effectiveType: '2g'
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    localVue.nextTick(() => {
      global.navigator.connection.effectiveType = '4g'
      map.change()
    })
    await localVue.nextTick()

    expect(wrapper.vm.effectiveConnectionType).toBe('4g')
  })

  test('should remove the listener for the navigator.connection change event on unmount', async () => {
    global.navigator.connection = {
      ...ectStatusListener,
      effectiveType: '2g'
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveNetwork, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    wrapper.destroy()
    testEctStatusEventListenerMethod(ectStatusListener.removeEventListener)
  })
})
