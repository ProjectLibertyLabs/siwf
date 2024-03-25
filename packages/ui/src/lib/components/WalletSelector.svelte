<script lang="ts">
  import type { ConfiguredExtension } from './extensionsConfig.ts';
  import { extensionsConfig } from './extensionsConfig.js';
  import WalletButton from './WalletButton.svelte';
  import type { WalletSelectedEvent } from '$lib/types/events.js';

  export let extensions: ConfiguredExtension[] = Object.values(extensionsConfig);
  export let onSelectedWallet: (event: WalletSelectedEvent) => Promise<void>;
</script>

<div class=" container grid w-full grid-flow-row-dense grid-cols-2 gap-2">
  {#each extensions as extension}
    <WalletButton extensionMetadata={extension} on:walletSelected={onSelectedWallet} />
  {/each}
</div>
