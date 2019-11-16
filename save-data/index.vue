<template>
  <div class="vue-adaptive-save-data">
    <slot v-bind="{ unsupported, saveData }" />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveSaveData',
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

      const { unsupported, saveData } = useSaveData()

      if (!unsupported) {
        this.saveData = saveData
      } else {
        this.unsupported = true
      }
    }
  }
}
</script>
