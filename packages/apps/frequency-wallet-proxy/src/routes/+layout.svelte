<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';

  onMount(async () => {
    resolveInjectedWeb3(window.injectedWeb3);
  });
</script>

<div class="absolute left-0 top-0 h-[355px] w-[100%] bg-white bg-opacity-50" id="bgmask" />
<div class="container mx-auto h-[600px] w-[380px]">
  <slot />
</div>
