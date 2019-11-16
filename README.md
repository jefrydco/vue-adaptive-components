# Vue Adaptive Loading Components &amp; Utilities

![](https://img.shields.io/github/license/jefrydco/vue-adaptive-components.svg) [![CircleCI](https://circleci.com/gh/jefrydco/vue-adaptive-components.svg?style=svg)](https://circleci.com/gh/jefrydco/vue-adaptive-components) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-adaptive-components)

> Deliver experiences best suited to a user's device and network constraints (experimental)

This is a suite of [Vue Components](https://vuejs.org/v2/guide/components.html) and utilities for adaptive loading based on a user's:

* [Network via effective connection type](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType)
* [Data Saver preferences](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)
* [Device memory](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory)
* [Logical CPU cores](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)

It can be used to add patterns for adaptive resource loading, data-fetching, code-splitting and capability toggling.

## Objective

Make it easier to target low-end devices while progressively adding high-end-only features on top. Using these hooks and utilities can help you give users a great experience best suited to their device and network constraints.

## Installation

`npm i vue-adaptive-components --save` or `yarn add vue-adaptive-components`

## Usage

You can import the components you wish to use as follows:

```js
import VueAdaptiveNetwork from 'vue-adaptive-components/network';
import VueAdaptiveSaveData from 'vue-adaptive-components/save-data';
import VueAdaptiveMemory from 'vue-adaptive-components/hardware-concurrency';
import VueAdaptiveHardwareConcurrency from 'vue-adaptive-components/memory';
```

and then use them in your components. Examples for each component and utility can be found below:

### Network

`VueAdaptiveNetwork` Vue component for getting network status (effective connection type)

```html
<template>
  <vue-adaptive-network>
    <template v-slot="{ effectiveConnectionType }">
      <img v-if="effectiveConnectionType === 'slow-2g'" src='...' alt='low resolution' />
      <img v-else-if="effectiveConnectionType === '2g'" src='...' alt='medium resolution' />
      <img v-else-if="effectiveConnectionType === '3g'" src='...' alt='high resolution' />
      <video v-else-if="effectiveConnectionType === '4g'" muted="" controls="">...</video>
      <video v-else="" muted="" controls="">...</video>
    </template>
  </vue-adaptive-network>
</template>

<script>
import VueAdaptiveNetwork from 'vue-adaptive-components/network'

export default {
  components: {
    VueAdaptiveNetwork
  }
}
</script>
```

`effectiveConnectionType` values can be `slow-2g`, `2g`, `3g`, or `4g`.

This hook accepts an optional `initialEffectiveConnectionType` string argument, which can be used to provide a `effectiveConnectionType` state value when the user's browser does not support the relevant [NetworkInformation API](https://wicg.github.io/netinfo/). Passing an initial value can also prove useful for server-side rendering, where the developer can pass an [ECT Client Hint](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints#ect) to detect the effective network connection type.

```js
// Inside of a functional React component
const initialEffectiveConnectionType = '4g';
const { effectiveConnectionType } = useNetworkStatus(initialEffectiveConnectionType);
```

### Save Data

`VueAdaptiveSaveData` Utility for getting Save Data whether it's Lite mode enabled or not

```html
<template>
  <vue-adaptive-save-data>
    <template v-slot="{ saveData }">
      <img v-if="saveData" src='...' />
      <video v-else="" muted="" controls="">...</video>
    </template>
  </vue-adaptive-save-data>
</template>

<script>
import VueAdaptiveSaveData from 'vue-adaptive-components/save-data'

export default {
  components: {
    VueAdaptiveSaveData
  }
}
</script>
```

`saveData` values can be `true` or `false`.

This hook accepts an optional `initialSaveDataStatus` boolean argument, which can be used to provide a `saveData` state value when the user's browser does not support the relevant [NetworkInformation API](https://wicg.github.io/netinfo/). Passing an initial value can also prove useful for server-side rendering, where the developer can pass a server [Save-Data Client Hint](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints#save-data) that has been converted to a boolean to detect the user's data saving preference.

```js
// Inside of a functional React component
const initialSaveDataStatus = true;
const { saveData } = useSaveData(initialSaveDataStatus);
```

### CPU Cores / Hardware Concurrency

`VueAdaptiveHardwareConcurrency` Utility for getting the number of logical CPU processor cores of the user's device

```html
<template>
  <vue-adaptive-hardware-concurrency>
    <template v-slot="{ numberOfLogicalProcessors }">
      <img v-if="numberOfLogicalProcessors <= 4" src='...' />
      <video v-else="" muted="" controls="">...</video>
    </template>
  </vue-adaptive-hardware-concurrency>
</template>

<script>
import VueAdaptiveHardwareConcurrency from 'vue-adaptive-components/hardware-concurrency'

export default {
  components: {
    VueAdaptiveHardwareConcurrency
  }
}
</script>
```

### Memory

`VueAdaptiveMemoryStatus` Utility for getting memory status of the device

```html
<template>
  <vue-adaptive-memory-status>
    <template v-slot="{ deviceMemory }">
      <img v-if="deviceMemory < 4" src='...' />
      <video v-else="" muted="" controls="">...</video>
    </template>
  </vue-adaptive-memory-status>
</template>

<script>
import VueAdaptiveMemoryStatus from 'vue-adaptive-components/memory'

export default {
  components: {
    VueAdaptiveMemoryStatus
  }
}
</script>
```

### Adaptive Code-loading & Code-splitting

#### Code-loading

Deliver a light, interactive core experience to users and progressively add high-end-only features on top, if a users hardware can handle it. Below is an example using the Network Status component:

```html
<template>
  <vue-adaptive-network>
    <template v-slot="{ effectiveConnectionType }">
      <vue-full v-if="effectiveConnectionType === '4g'"/>
      <vue-light v-else="" />
    </template>
  </vue-adaptive-network>
</template>

<script>
import VueAdaptiveNetwork from 'vue-adaptive-components/network'

export default {
  components: {
    VueAdaptiveNetwork,
    VueFull: () => import(/* webpackChunkName: "full" */'./vue-full'),
    VueLight: () => import(/* webpackChunkName: "light" */'./vue-light)
  }
}
</script>
```

vue-light.vue:
```html
<template functional>
  <img :src="props.imageUrl" alt='product' />
</template>
```

vue-full.vue:
```html
<template>
  <vue-magnifier :src="imageUrl" :src-large="imageLargeUrl" alt='product' />
</template>

<script>
import VueMagnifier from 'vue-magnifier'

export default {
  components: {
    VueMagnifier
  }
}
</script>
```

## Browser Support

* [Network Information API - effectiveType](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType) is available in [Chrome 61+, Opera 48+, Edge 76+, Chrome for Android 76+, Firefox for Android 68+](https://caniuse.com/#search=effectiveType)

* [Save Data API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData) is available in [Chrome 65+, Opera 62+, Chrome for Android 76+, Opera for Android 46+](https://caniuse.com/#search=saveData)

* [Hardware Concurrency API](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency) is available in [Chrome 37+, Safari 10.1+, Firefox 48+, Opera 24+, Edge 15+, Chrome for Android 76+, Safari on iOS 10.3+, Firefox for Android 68+, Opera for Android 46+](https://caniuse.com/#search=navigator.hardwareConcurrency)

* [Performance memory API](https://developer.mozilla.org/en-US/docs/Web/API/Performance) is a non-standard and only available in [Chrome 7+, Opera, Chrome for Android 18+, Opera for Android](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)

* [Device Memory API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory) is available in [Chrome 63+, Opera 50+, Chrome for Android 76+, Opera for Android 46+](https://caniuse.com/#search=deviceMemory)

## Demos

### Network

* [Network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-loading/))
* [Network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-code-splitting) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-code-splitting/))
* [Network-aware data-fetching](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-data-fetching) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-data-fetching/))

* [React Movie - network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-movie-network-aware-loading) ([Live](https://adaptive-loading.web.app/react-movie-network-aware-loading/))
* [React Shrine - network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-shrine-network-aware-code-splitting) ([Live](https://adaptive-loading.web.app/react-shrine-network-aware-code-splitting/))
* [React eBay - network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-ebay-network-aware-code-splitting) ([Live](https://adaptive-loading.web.app/react-ebay-network-aware-code-splitting/))
* [React Lottie - network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-lottie-network-aware-loading) ([Live](https://adaptive-loading.web.app/react-lottie-network-aware-loading/))

### Save Data

* [React Twitter - save-data loading based on Client Hint](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-twitter-save-data-loading(client-hint)) ([Live](https://adaptive-loading.web.app/react-twitter-save-data-loading(client-hint)/))
* [React Twitter - save-data loading based on Hook](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-twitter-save-data-loading(hook)) ([Live](https://adaptive-loading.web.app/react-twitter-save-data-loading(hook)/))

### CPU Cores / Hardware Concurrency

* [Hardware concurrency considerate code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-hardware-concurrency-considerate-code-splitting) with create-react-app ([Live](https://adaptive-loading.web.app/cra-hardware-concurrency-considerate-code-splitting/))
* [Hardware concurrency considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-hardware-concurrency-considerate-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-hardware-concurrency-considerate-loading/))

### Memory

* [Memory considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-memory-considerate-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-memory-considerate-loading/))
* [Memory considerate loading (SketchFab version)](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-memory-considerate-loading-sketchfab) with create-react-app ([Live](https://adaptive-loading.web.app/cra-memory-considerate-loading-sketchfab/))
* [Memory-considerate animation-toggling](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cna-memory-considerate-animation) with create-next-app ([Live](https://adaptive-loading.web.app/cna-memory-considerate-animation/))

* [React Dixie Mesh - memory considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-dixie-memory-considerate-loading) ([Live](https://adaptive-loading.web.app/react-dixie-memory-considerate-loading/))

### Hybrid

* [React Youtube - adaptive loading with mix of network, memory and hardware concurrency](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-youtube-adaptive-loading) ([Live](https://adaptive-loading.web.app/react-youtube-adaptive-loading/))


## References

* [Adaptive serving based on network quality](https://web.dev/adaptive-serving-based-on-network-quality/)
* [Adaptive Serving using JavaScript and the Network Information API](https://addyosmani.com/blog/adaptive-serving/)
* [Serving Adaptive Components Using the Network Information API](https://dev.to/vorillaz/serving-adaptive-components-using-the-network-information-api-lbo)

## License

Licensed under the Apache-2.0 license.

## Team

This project is brought to you by [Addy Osmani](https://github.com/addyosmani) and [Anton Karlovskiy](https://github.com/anton-karlovskiy).

Ported to Vue by [jefrydco](https://github.com/jefrydco).