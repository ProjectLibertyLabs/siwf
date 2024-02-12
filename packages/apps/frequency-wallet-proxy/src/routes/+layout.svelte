<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';

  onMount(async () => {
    resolveInjectedWeb3(window.injectedWeb3);
  });
</script>

<slot />
