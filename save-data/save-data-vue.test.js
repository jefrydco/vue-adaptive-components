import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveSaveData from './index.vue'

afterEach(() => {
  jest.resetModules()
})

describe('vue-adaptive-save-data', () => {
  test('should return "true" for unsupported case', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
    expect(wrapper.vm.saveData).toEqual(null)
  })

  test('should return initialSaveDataStatus for unsupported case', async () => {
    const initialSaveDataStatus = true
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      propsData: {
        initialSaveDataStatus: initialSaveDataStatus
      },
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(true)
    expect(wrapper.vm.saveData).toBe(initialSaveDataStatus)
  })

  test('should return "true" for enabled save data', async () => {
    global.navigator.connection = {
      saveData: true
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: `<template>{{ props }}</template>`
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.saveData).toEqual(navigator.connection.saveData)
  })

  test('should return "false" for disabled save data', async () => {
    global.navigator.connection = {
      saveData: false
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: `<template>{{ props }}</template>`
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.saveData).toEqual(navigator.connection.saveData)
  })

  test('should not return initialSaveDataStatus for supported case', async () => {
    const initialSaveDataStatus = false
    global.navigator.connection = {
      saveData: true
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      propsData: {
        initialSaveDataStatus: initialSaveDataStatus
      },
      scopedSlots: {
        default: '<template>{{ props }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.vm.unsupported).toBe(false)
    expect(wrapper.vm.saveData).toBe(navigator.connection.saveData)
  })
})
