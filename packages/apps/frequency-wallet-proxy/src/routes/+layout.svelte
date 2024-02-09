<script lang="ts">
  import {
    type ConnectedExtensionMap,
    ConnectedExtensionsDerivedStore,
  } from '$lib/stores/derived/ConnectedExtensionsStore';
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsStore';

  let connectedExtensionsMap: ConnectedExtensionMap = {};

  $: {
    if ($ConnectedExtensionsDerivedStore) {
      $ConnectedExtensionsDerivedStore.then((value) => {
        connectedExtensionsMap = value;
      });
    }
  }

  onMount(async () => {
    resolveInjectedWeb3(window.injectedWeb3);
  });
</script>

<slot />
