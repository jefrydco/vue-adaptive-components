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
    this.checkSupport()
    this.initSaveDataStatus()
  },
  methods: {
    checkSupport() {
      if ('connection' in navigator && 'saveData' in navigator.connection) {
        this.unsupported = false
      } else {
        this.unsupported = true
      }
    },
    initSaveDataStatus() {
      this.saveData = this.unsupported
        ? null
        : navigator.connection.saveData === true
    }
  }
}
</script>
