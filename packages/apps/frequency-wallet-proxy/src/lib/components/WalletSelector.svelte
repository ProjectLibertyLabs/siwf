<script lang="ts">
  import type { ConfiguredExtension } from './extensionsConfig.ts';
  import { extensionsConfig } from './extensionsConfig.js';
  import WalletButton from './WalletButton.svelte';

  export let extensions: ConfiguredExtension[] = Object.values(extensionsConfig);
  export let onSelectedWallet: (event: CustomEvent) => Promise<void>;
</script>

<div class="xs:mx-12 sm:w-500 md:w-800 mx-auto flex flex-col gap-2">
  {#each extensions as extension}
    <WalletButton {extension} on:walletSelected={onSelectedWallet} />
  {/each}
</div>
