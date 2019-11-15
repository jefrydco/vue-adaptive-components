<template>
  <div class="vue-adaptive-hardware-concurrency">
    <slot
      v-bind="{
        unsupported,
        ...initialHardwareConcurrency
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveHardwareConcurrency',
  data() {
    return {
      unsupported: false,
      initialHardwareConcurrency: {
        numberOfLogicalProcessors: null
      }
    }
  },
  mounted() {
    this.checkSupport()
    this.initHardwareConcurrency()
  },
  methods: {
    checkSupport() {
      if (
        typeof navigator !== 'undefined' &&
        'hardwareConcurrency' in navigator
      ) {
        this.unsupported = false
      } else {
        this.unsupported = true
      }
    },
    initHardwareConcurrency() {
      if (!this.unsupported) {
        this.initialHardwareConcurrency = {
          numberOfLogicalProcessors: navigator.hardwareConcurrency
        }
      } else {
        this.initialHardwareConcurrency = {
          unsupported: this.unsupported
        }
      }
    }
  }
}
</script>
