<template>
  <div class="vue-adaptive-network">
    <slot v-bind="{ unsupported, ...networkStatus }" />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveNetwork',
  data() {
    return {
      unsupported: false,
      networkStatus: {
        effectiveConnectionType: null
      }
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
      this.networkStatus = !this.unsupported
        ? {
            effectiveConnectionType: navigator.connection.effectiveType
          }
        : {
            unsupported: this.unsupported
          }
    },
    updateECTStatus() {
      const navigatorConnection = navigator.connection
      this.networkStatus = {
        effectiveConnectionType: navigatorConnection.effectiveType
      }
    },
    initEventListener() {
      const navigatorConnection = navigator.connection
      navigatorConnection.addEventListener('change', this.updateECTStatus)
    },
    removeEventListener() {
      const navigatorConnection = navigator.connection
      navigatorConnection.removeEventListener('change', this.updateECTStatus)
    }
  }
}
</script>
