import { mount, createLocalVue } from '@vue/test-utils'
import VueAdaptiveSaveData from './index.vue'

describe('vue-adaptive-save-data', () => {
  test('should return "true" for unsupported case', async () => {
    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: '<template>{{ props.unsupported }}</template>'
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain('true')
  })

  test('should return "saving" for enabled save data', async () => {
    global.navigator.connection = {
      saveData: true
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: `
          <template>
            {{ props.saveData ? 'saving' : 'not saving' }}
          </template>
        `
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain('saving')
  })

  test('should return "not saving" for disabled save data', async () => {
    global.navigator.connection = {
      saveData: false
    }

    const localVue = createLocalVue()

    const wrapper = mount(VueAdaptiveSaveData, {
      localVue,
      scopedSlots: {
        default: `
          <template>
            {{ props.saveData ? 'saving' : 'not saving' }}
          </template>
        `
      }
    })

    await localVue.nextTick()
    expect(wrapper.html()).toContain('not saving')
  })
})
