import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveHardwareConcurrency from './index.vue'

afterEach(() => {
  jest.resetModules()
})

describe('vue-adaptive-hardware-concurrency', () => {
  const navigator = window.navigator

  afterEach(() => {
    if (!window.navigator) {
      window.navigator = navigator
    }
  })

  test('should return "true" for unsupported case', async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    })

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveHardwareConcurrency, {
      localVue,
      scopedSlots: {
        default: `<template>{{ props }}</template>`
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
  })

  test('should return global.navigator.hardwareConcurrency', async () => {
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
    expect(wrapper.vm.numberOfLogicalProcessors).toBe(4)
  })

  test('should return 2 for device of hardwareConcurrency = 2', async () => {
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
    expect(wrapper.vm.numberOfLogicalProcessors).toBe(2)
  })
})
