import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveBattery from './index.vue'

afterEach(() => {
  jest.resetModules()
})

const getBatteryStatus = currentResult => ({
  unsupported: false,
  chargingTime: currentResult.chargingTime,
  dischargingTime: currentResult.dischargingTime,
  level: currentResult.level,
  charging: currentResult.charging
})

describe('vue-adaptive-battery', () => {
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
    expect(method).toBeCalledTimes(4)
    expect(method.mock.calls[0][0]).toEqual('levelchange')
    expect(method.mock.calls[1][0]).toEqual('chargingchange')
    expect(method.mock.calls[2][0]).toEqual('dischargingtimechange')
    expect(method.mock.calls[3][0]).toEqual('chargingtimechange')

    expect(method.mock.calls[0][1].constructor).toEqual(Function)
    expect(method.mock.calls[1][1].constructor).toEqual(Function)
    expect(method.mock.calls[2][1].constructor).toEqual(Function)
    expect(method.mock.calls[3][1].constructor).toEqual(Function)
  }

  test('should return "true" for unsupported case', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
  })

  test('should return initialBatteryStatus for unsupported case', async () => {
    const mockInitialBatteryStatus = {
      charging: false
    }

    const { charging } = mockInitialBatteryStatus

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue,
      propsData: {
        initialBatteryStatus: mockInitialBatteryStatus
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
    expect(wrapper.vm.batteryStatus.charging).toEqual(charging)
  })

  test('should return mockBattery status', async () => {
    const mockBatteryStatus = {
      chargingTime: 3000,
      dischargingTime: Infinity,
      level: 0.11,
      charging: false
    }

    global.navigator.getBattery = () =>
      Promise.resolve({
        ...mockBatteryStatus,
        ...ectStatusListener
      })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue
    })

    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    expect(getBatteryStatus(wrapper.vm.batteryStatus)).toEqual({
      ...mockBatteryStatus,
      unsupported: false
    })
  })

  test('should not return initialBatteryStatus for supported case', async () => {
    const initialBatteryStatus = {
      chargingTime: 1000,
      dischargingTime: Infinity,
      level: 0.33,
      charging: false
    }

    const mockBatteryStatus = {
      chargingTime: 9000,
      dischargingTime: Infinity,
      level: 0.99,
      charging: true
    }

    global.navigator.getBattery = () =>
      Promise.resolve({
        ...mockBatteryStatus,
        ...ectStatusListener
      })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue,
      propsData: {
        initialBatteryStatus
      }
    })

    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.batteryStatus).not.toEqual(initialBatteryStatus)
  })

  test('should update the batteryStatus state', async () => {
    const mockBatteryStatus = {
      chargingTime: 9000,
      dischargingTime: Infinity,
      level: 0.99,
      charging: true
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue
    })

    wrapper.setData({ batteryStatus: mockBatteryStatus })
    await localVue.nextTick()

    expect(wrapper.vm.batteryStatus).toEqual(mockBatteryStatus)
  })

  test('should update the batteryStatus state when batteryManager listener change event', async () => {
    const mockBatteryStatus = {
      chargingTime: 1234,
      dischargingTime: 9876,
      level: 0.43,
      charging: false
    }

    const changedBatteryStatus = {
      chargingTime: 6000,
      dischargingTime: Infinity,
      level: 1,
      charging: true
    }

    const batteryStatus = {
      ...mockBatteryStatus,
      ...ectStatusListener
    }

    global.navigator.getBattery = () => Promise.resolve(batteryStatus)

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue
    })

    localVue.nextTick(() => {
      batteryStatus.charging = changedBatteryStatus.charging
      batteryStatus.dischargingTime = changedBatteryStatus.dischargingTime
      batteryStatus.level = changedBatteryStatus.level
      batteryStatus.chargingTime = changedBatteryStatus.chargingTime

      map.levelchange()
      map.chargingchange()
      map.dischargingtimechange()
      map.chargingtimechange()
    })
    await localVue.nextTick()

    expect(wrapper.vm.batteryStatus).not.toEqual(mockBatteryStatus)
    expect(wrapper.vm.batteryStatus).toEqual(changedBatteryStatus)
  })

  test('should remove the listener for batteryManager listener on unmount', async () => {
    const mockBatteryStatus = {
      chargingTime: 4444,
      dischargingTime: 7829,
      level: 0.11,
      charging: true
    }

    const batteryStatus = {
      ...mockBatteryStatus,
      ...ectStatusListener
    }

    global.navigator.getBattery = () => Promise.resolve(batteryStatus)

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveBattery, {
      localVue
    })

    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.addEventListener)
    wrapper.destroy()
    await localVue.nextTick()
    testEctStatusEventListenerMethod(ectStatusListener.removeEventListener)
  })
})
