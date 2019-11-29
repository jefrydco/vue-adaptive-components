<template>
  <div class="vue-adaptive-network">
    <slot v-bind="{ unsupported, effectiveConnectionType }" />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveNetwork',
  props: {
    initialEffectiveConnectionType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      unsupported: false,
      effectiveConnectionType: null
    }
  },
  mounted() {
    this.checkSupport()
    this.initNetworkStatus()
    this.initEventListener()
  },
  beforeDestroy() {
    this.removeEventListener()
  },
  methods: {
    checkSupport() {
      if (
        'connection' in navigator &&
        'effectiveType' in navigator.connection
      ) {
        this.unsupported = false
      } else {
        this.unsupported = true
      }
    },
    initNetworkStatus() {
      this.effectiveConnectionType = !this.unsupported
        ? navigator.connection.effectiveType
        : this.initialEffectiveConnectionType
    },
    updateECTStatus() {
      const navigatorConnection = navigator.connection
      this.effectiveConnectionType = navigatorConnection.effectiveType
    },
    initEventListener() {
      if (!this.unsupported) {
        const navigatorConnection = navigator.connection
        navigatorConnection.addEventListener('change', this.updateECTStatus)
      }
    },
    removeEventListener() {
      const navigatorConnection = navigator.connection
      navigatorConnection.removeEventListener('change', this.updateECTStatus)
    }
  }
}
</script>
