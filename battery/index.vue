<template>
  <div class="vue-adaptive-battery">
    <slot
      :batteryStatus="{
        unsupported,
        ...batteryStatus
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'VueAdaptiveBattery',
  props: {
    initialBatteryStatus: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      unsupported: false,
      batteryStatus: {
        chargingTime: null,
        dischargingTime: null,
        level: null,
        charging: null
      }
    }
  },
  async mounted() {
    this.checkSupport()
    await this.initBatteryStatus()
  },
  beforeDestroy() {
    this.removeEventListener()
  },
  methods: {
    checkSupport() {
      if ('getBattery' in navigator) {
        this.unsupported = false
      } else {
        this.unsupported = true
      }
    },
    async initBatteryStatus() {
      if (!this.unsupported) {
        const batteryManager = await navigator.getBattery()
        this.updateBatteryStatus(batteryManager)
        this.initEventListener(batteryManager)
      } else {
        this.updateBatteryStatus({
          ...this.batteryStatus,
          ...this.initialBatteryStatus
        })
      }
    },
    updateBatteryStatus(batteryManager) {
      this.batteryStatus = {
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime,
        level: batteryManager.level,
        charging: batteryManager.charging
      }
    },
    initEventListener(batteryManager) {
      if (!this.unsupported) {
        batteryManager.addEventListener(
          'levelchange',
          this.updateBatteryStatus.bind(null, batteryManager)
        )
        batteryManager.addEventListener(
          'chargingchange',
          this.updateBatteryStatus.bind(null, batteryManager)
        )
        batteryManager.addEventListener(
          'dischargingtimechange',
          this.updateBatteryStatus.bind(null, batteryManager)
        )
        batteryManager.addEventListener(
          'chargingtimechange',
          this.updateBatteryStatus.bind(null, batteryManager)
        )
      }
    },
    async removeEventListener() {
      const batteryManager = await navigator.getBattery()
      batteryManager.removeEventListener(
        'levelchange',
        this.updateBatteryStatus.bind(null, batteryManager)
      )
      batteryManager.removeEventListener(
        'chargingchange',
        this.updateBatteryStatus.bind(null, batteryManager)
      )
      batteryManager.removeEventListener(
        'dischargingtimechange',
        this.updateBatteryStatus.bind(null, batteryManager)
      )
      batteryManager.removeEventListener(
        'chargingtimechange',
        this.updateBatteryStatus.bind(null, batteryManager)
      )
    }
  }
}
</script>

<style></style>
