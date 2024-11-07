<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import baselineDownload from '@iconify/icons-ic/baseline-download.js';
  import baselineBlock from '@iconify/icons-ic/baseline-block.js';
  import baselineCheck from '@iconify/icons-ic/baseline-check.js';
  import mdiConnection from '@iconify/icons-mdi/connection.js';
  import type { ConfiguredExtension } from '.';
  import { CachedExtensionsStore, ExtensionAuthorizationEnum } from '$lib/stores/CachedExtensionsStore';

  const dispatch = createEventDispatcher();
  export let extensionMetadata: ConfiguredExtension;

  /* eslint svelte/valid-compile: "off" */
  $: cachedExtension = $CachedExtensionsStore?.[extensionMetadata.injectedName] ?? {
    injectedName: extensionMetadata.injectedName,
    installed: false,
    authorized: ExtensionAuthorizationEnum.None,
  };

  function selectWallet() {
    dispatch('walletSelected', { injectedName: extensionMetadata.injectedName });
  }

  function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case ' ': {
        event.stopPropagation;
        selectWallet();
        break;
      }
    } //end switch
  }
</script>

<div
  role="button"
  tabindex="0"
  class="flex w-[100%] items-start justify-between rounded-lg bg-white bg-opacity-20 p-3 font-bold"
  on:keydown={handleKeyPress}
  on:click={() => selectWallet()}
>
  <div class="flex flex-col gap-2">
    <div>
      <svelte:component this={extensionMetadata.logo.component} size="30" />
    </div>
    <div class="text-left text-xs font-bold">{extensionMetadata.displayName}</div>
  </div>
  <div>
    {#if !cachedExtension.installed}
      <Icon icon={baselineDownload} class="h-[25px] w-[25px]" />
    {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.None}
      <Icon icon={mdiConnection} class="h-[25px] w-[25px]" />
    {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.Rejected}
      <Icon icon={baselineBlock} class="h-[25px] w-[25px]" />
    {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.Authorized}
      <Icon icon={baselineCheck} class="h-[25px] w-[25px]" />
    {/if}
  </div>
</div>
