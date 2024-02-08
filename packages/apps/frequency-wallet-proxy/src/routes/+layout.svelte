<script lang="ts">
  import { CachedExtensionsStore } from '$lib/stores/CachedExtensionsStore';
  import { Web3Store } from '$lib/stores/Web3Store';
  import { type ConnectedExtensionMap, ConnectedExtensionsStore } from '$lib/stores/derived/ConnectedExtensionsStore';
  import { isExtensionInstalled } from '@frequency-control-panel/utils';
  import { onMount } from 'svelte';

  let connectedExtensionsMap: ConnectedExtensionMap = new Map();

  $: {
    if ($Web3Store) {
      for (const cachedExt of $CachedExtensionsStore.values()) {
        const installed = isExtensionInstalled(cachedExt.injectedName);
        if (installed !== cachedExt.installed) {
          cachedExt.installed = installed;
          CachedExtensionsStore.updateExtension(cachedExt);
        }
      }
    }

    if ($ConnectedExtensionsStore) {
      $ConnectedExtensionsStore.then((value) => {
        connectedExtensionsMap = value;
      });
    }
  }

  onMount(async () => {
    if (window?.injectedWeb3) {
      Web3Store.set(window.injectedWeb3);
    }
  });
</script>

<slot />
