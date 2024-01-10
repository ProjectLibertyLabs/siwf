<script lang="ts">
  import type { Extension } from './extensionsConfig.ts';
  import { onMount } from 'svelte';
  import { extensionsConfig, Extension } from './extensionsConfig.js';
  import WalletButton from './WalletButton.svelte';

  export let extensions: Extension[] = [];
  export let onSelectedWallet: (extension) => Promise<void>;

  onMount(() => {
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
    <WalletButton {extension} on:walletSelected={onSelectedWallet} />
  {/each}
</div>
