<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import type { Extension } from './extensionsConfig.js';
  import { isWalletInstalled } from '@frequency-control-panel/utils';
  import baselineDownload from '@iconify/icons-ic/baseline-download';

  const dispatch = createEventDispatcher();

  export let extension: Extension;
  let installed = false;
  $: buttonText = installed ? 'Sign in with' : 'Install';


  async function onReady<T = InjectedWindow>(): Promise<T | null> {
    await new Promise((resolve) => window.addEventListener('load', resolve));
    console.log('Window ready');
  }

   function walletDetected(): boolean {
    installed = isWalletInstalled(extension.injectedName);
    return installed;
  }

  onMount(async (): Promise<void> => {
    await onReady();
 })


  function selectWallet() {
    if (installed) {
      dispatch('wallet_selected', extension);
    } else {
      dispatch('install_wallet', extension);
    }
  }


</script>

<button type="button" class="btn-banner font-bold" on:click={() => selectWallet()}>
  <div class="flex items-center justify-center gap-3">
    <div class="basis-3/12">
      <svelte:component this={extension.logo.component} size={extension.logo.size} />
    </div>
        <div class="ml-8 text-left basis-5/8">
          <div class="text-3xl">{extension.displayName}</div>
          <span class="text-sm italic antialiased">{buttonText} {extension.displayName}</span
          >
        </div>
        <div class="basis-1/12 w-4">
          <!--
             Tiny delay here to work around an injection timing bug with the polkadot-js wallet extension.
             Without this, we get a false negative for the polkadot-js extension about 10% of the time.
          -->
            {#await new Promise(resolve => setTimeout(resolve, 50)) then}
              {#if !walletDetected()}
                <Icon icon={baselineDownload} width="30" height="30" />
              {/if}
            {/await}
        </div>
  </div>
</button>
