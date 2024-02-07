<script lang="ts">
  import { CachedExtensionsStore, Web3Store } from '$lib/stores';
  import { isExtensionInstalled } from '@frequency-control-panel/utils';
  import { onMount } from 'svelte';

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
  }

  onMount(async () => {
    Web3Store.set(window.injectedWeb3);
  });
</script>

<slot />
