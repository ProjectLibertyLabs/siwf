<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import baselineDownload from '@iconify/icons-ic/baseline-download.js';
  import baselineBlock from '@iconify/icons-ic/baseline-block.js';
  import baselineCheck from '@iconify/icons-ic/baseline-check.js';
  import mdiConnection from '@iconify/icons-mdi/connection.js';
  import { ExtensionAuthorizationEnum, CachedExtensionsStore } from '$lib/stores';
  import type { ConfiguredExtension } from '.';

  const dispatch = createEventDispatcher();
  export let extension: ConfiguredExtension;

  $: cachedExtension = $CachedExtensionsStore.get(extension.injectedName) ?? {
    injectedName: extension.injectedName,
    installed: false,
    authorized: ExtensionAuthorizationEnum.None,
  };

  $: buttonText = cachedExtension.installed ? 'Sign in with' : 'Install';

  function selectWallet() {
    dispatch('walletSelected', { extension, extensionAuth: cachedExtension });
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
  class="btn-banner font-bold"
  on:keydown={handleKeyPress}
  on:click={() => selectWallet()}
>
  <div class="flex items-center justify-center gap-3">
    <div class="basis-3/12">
      <svelte:component this={extension.logo.component} size={extension.logo.size} />
    </div>
    <div class="basis-5/8 ml-8 text-left">
      <div class="text-3xl">{extension.displayName}</div>
      <span class="text-sm italic antialiased">{buttonText} {extension.displayName}</span>
    </div>
    <div class="w-4 basis-1/12">
      {#if !cachedExtension.installed}
        <Icon icon={baselineDownload} width="30" height="30" />
      {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.None}
        <Icon icon={mdiConnection} width="30" height="30" />
      {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.Rejected}
        <Icon icon={baselineBlock} width="30" height="30" />
      {:else if cachedExtension?.authorized === ExtensionAuthorizationEnum.Authorized}
        <Icon icon={baselineCheck} width="30" height="30" />
      {/if}
    </div>
  </div>
</div>
