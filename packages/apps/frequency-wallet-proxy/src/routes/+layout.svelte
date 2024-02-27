<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';
  import FrequencyLogo from '$lib/icons/FrequencyLogo.svelte';
  import { defaultConfig, resolveSchemas, WindowEndpoint } from '@frequency-control-panel/utils';

  onMount(async () => {
    resolveInjectedWeb3(window.injectedWeb3);
    await WindowEndpoint.create();
    await resolveSchemas(defaultConfig.schemas);
  });
</script>

<div class="absolute left-0 top-0 h-[355px] w-[100%] bg-white bg-opacity-50" id="bgmask" />
<div class="container mx-auto h-[600px] w-[380px]">
  <div class="items-center justify-center">
    <div class="flex items-center justify-center pb-[60px] pt-[60px]">
      <svelte:component this={FrequencyLogo} />
    </div>
    <slot />
  </div>
</div>
