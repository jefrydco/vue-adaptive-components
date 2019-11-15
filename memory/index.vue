<template>
  <div class="vue-adaptive-memory-status">
    <slot :memoryStatus="{ unsupported, ...initialMemoryStatus }" />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveMemoryStatus',
  data() {
    return {
      unsupported: false,
      initialMemoryStatus: {
        deviceMemory: null,
        totalJSHeapSize: null,
        usedJSHeapSize: null,
        jsHeapSizeLimit: null
      }
    }
  },
  mounted() {
    this.checkSupport()
    this.initMemoryStatus()
  },
  methods: {
    checkSupport() {
      if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
        this.unsupported = false
      } else {
        this.unsupported = true
      }
    },
    initMemoryStatus() {
      if (!this.unsupported) {
        const performanceMemory =
          'memory' in performance ? performance.memory : null
        this.initialMemoryStatus = {
          deviceMemory: navigator.deviceMemory,
          totalJSHeapSize: performanceMemory
            ? performanceMemory.totalJSHeapSize
            : null,
          usedJSHeapSize: performanceMemory
            ? performanceMemory.usedJSHeapSize
            : null,
          jsHeapSizeLimit: performanceMemory
            ? performanceMemory.jsHeapSizeLimit
            : null
        }
      } else {
        this.initialMemoryStatus = { unsupported: this.unsupported }
      }
    }
  }
}
</script>
