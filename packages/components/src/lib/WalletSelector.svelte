<script lang="ts">
  import { onMount } from 'svelte';
  import { extensionsConfig, Extension } from './extensionsConfig.js';
  import WalletButton from './WalletButton.svelte';

  export let extensions: Extension[] = [];

  onMount(async () => {
    extensions = extensionsConfig;
  });

  function handleSelectedWallet(event) {
    console.log(`Selected wallet: ${JSON.stringify(event.detail)}`);
  }

  function handleInstallWallet(event) {
    console.log(`Install wallet: ${JSON.stringify(event.detail)}`);
  }
</script>

<div class="xs:mx-12 sm:w-500 md:w-800 mx-auto flex flex-col gap-2">
  {#each extensions as extension}
    <WalletButton {extension} on:wallet_selected={handleSelectedWallet} on:install_wallet={handleInstallWallet} />
  {/each}
</div>
