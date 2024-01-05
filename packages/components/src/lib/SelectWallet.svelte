<script lang="ts">
  import { onMount } from 'svelte';
  import { extensionsConfig } from './extensionsConfig.js';
  import type { Extension } from './extensionsConfig.js';

  export let extensions: Array<Extension> = [];

  onMount(async () => {
    extensions = extensionsConfig;
    console.log({ extensions });
  });

  async function handleSelectedWallet(injectedName: string) {
    alert(`Selected wallet: ${injectedName}`);
  }
</script>

<div class="xs:mx-12 sm:w-500 md:w-800 mx-auto flex flex-col gap-2">
  {#each extensions as extension}
    <button type="button" class="btn-banner font-bold" on:click={() => handleSelectedWallet(extension.injectedName)}>
      <div class="flex items-center justify-center gap-3">
        <div class="basis-3/12">
          <svelte:component this={extension.logo.component} size={extension.logo.size} />
        </div>
        <div class="basis-5/8 ml-8 text-left">
          <div class="text-3xl">{extension.displayName}</div>
          <span class="text-sm italic antialiased">Sign in with {extension.displayName}</span>
        </div>
      </div>
    </button>
  {/each}
</div>
