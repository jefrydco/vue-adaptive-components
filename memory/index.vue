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
  props: {
    initialMemoryStatus: {
      type: Object,
      default() {
        return null
      }
    }
  },
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
      } = useMemoryStatus(this.initialMemoryStatus)

      this.unsupported = unsupported
      this.memoryStatus = {
        deviceMemory: deviceMemory,
        totalJSHeapSize: totalJSHeapSize,
        usedJSHeapSize: usedJSHeapSize,
        jsHeapSizeLimit: jsHeapSizeLimit
      }
    }
  }
}
</script>
