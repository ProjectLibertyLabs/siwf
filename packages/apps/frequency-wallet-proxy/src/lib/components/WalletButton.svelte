<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import baselineDownload from '@iconify/icons-ic/baseline-download.js';
  import { type Extension } from './extensionsConfig.js';
  import { ExtensionAuthorizationEnum, CachedExtensionsStore, type ExtensionAuthorization } from '$lib/stores';

  const dispatch = createEventDispatcher();

  export let extension: Extension;

  let extensionAuth: ExtensionAuthorization = {
    injectedName: extension.injectedName,
    installed: false,
    authorized: ExtensionAuthorizationEnum.None,
  };

  $: buttonText = extensionAuth.installed ? 'Sign in with' : 'Install';

  onMount(() => {
    const cachedExt = $CachedExtensionsStore.get(extension.injectedName);
    extensionAuth = {
      ...extensionAuth,
      ...cachedExt,
    };
  });

  function selectWallet() {
    dispatch('walletSelected', { extension, extensionAuth });
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
      {#if !extensionAuth.installed}
        <Icon icon={baselineDownload} width="30" height="30" />
      {:else if extensionAuth?.authorized === ExtensionAuthorizationEnum.None}
        <span class="text-sm italic antialiased">Connect</span>
      {:else if extensionAuth?.authorized === ExtensionAuthorizationEnum.Rejected}
        <span class="text-sm italic antialiased">Not Authorized</span>
      {/if}
    </div>
  </div>
</div>
