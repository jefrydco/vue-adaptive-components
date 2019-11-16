<template>
  <div class="vue-adaptive-memory-status">
    <slot
      :memoryStatus="{
        unsupported,
        ...memoryStatus
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveMemoryStatus',
  data() {
    return {
      unsupported: false,
      memoryStatus: {
        deviceMemory: null,
        totalJSHeapSize: null,
        usedJSHeapSize: null,
        jsHeapSizeLimit: null
      }
    }
  },
  mounted() {
    this.initMemoryStatus()
  },
  methods: {
    initMemoryStatus() {
      const { useMemoryStatus } = require('./index.upstream')

      const {
        unsupported,
        deviceMemory,
        totalJSHeapSize,
        usedJSHeapSize,
        jsHeapSizeLimit
      } = useMemoryStatus()

      if (!unsupported) {
        this.memoryStatus = {
          deviceMemory: deviceMemory,
          totalJSHeapSize: totalJSHeapSize,
          usedJSHeapSize: usedJSHeapSize,
          jsHeapSizeLimit: jsHeapSizeLimit
        }
      } else {
        this.unsupported = true
      }
    }
  }
}
</script>
