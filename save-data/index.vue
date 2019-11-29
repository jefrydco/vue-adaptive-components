<template>
  <div class="vue-adaptive-save-data">
    <slot v-bind="{ unsupported, saveData }" />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveSaveData',
  props: {
    initialSaveDataStatus: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      unsupported: false,
      saveData: null
    }
  },
  mounted() {
    this.initSaveDataStatus()
  },
  methods: {
    initSaveDataStatus() {
      const { useSaveData } = require('./index.upstream')

      const { unsupported, saveData } = useSaveData(this.initialSaveDataStatus)

      this.unsupported = unsupported
      this.saveData = saveData
    }
  }
}
</script>
