<template>
  <div class="vue-adaptive-hardware-concurrency">
    <slot
      v-bind="{
        unsupported,
        numberOfLogicalProcessors
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
      numberOfLogicalProcessors: null
    }
  },
  mounted() {
    this.initHardwareConcurrency()
  },
  methods: {
    initHardwareConcurrency() {
      const { useHardwareConcurrency } = require('./index.upstream')
      const {
        unsupported,
        numberOfLogicalProcessors
      } = useHardwareConcurrency()

      this.unsupported = unsupported
      this.numberOfLogicalProcessors = numberOfLogicalProcessors
    }
  }
}
</script>
