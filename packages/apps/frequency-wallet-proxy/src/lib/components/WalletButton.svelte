<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import type { Extension } from './extensionsConfig.js';
  import { isExtensionInstalled, delayMs } from '@frequency-control-panel/utils';
  import baselineDownload from '@iconify/icons-ic/baseline-download.js';

  const dispatch = createEventDispatcher();

  export let extension: Extension;
  let installed = false;
  $: buttonText = installed ? 'Sign in with' : 'Install';

  onMount(async (): Promise<void> => {
    //  Tiny delay here to work around an injection timing bug with the polkadot-js wallet extension.
    //  Without this, we get a false negative for the polkadot-js extension about 10% of the time.
    if (extension.injectedName === 'polkadot-js') {
      await delayMs(50);
    }
    installed = isExtensionInstalled(extension.injectedName);
  });

  function selectWallet() {
    dispatch('walletSelected', { ...extension, installed });
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
      {#if !installed}
        <Icon icon={baselineDownload} width="30" height="30" />
      {/if}
    </div>
  </div>
</div>
