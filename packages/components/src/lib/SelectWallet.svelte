<script lang="ts">
  import { onMount } from 'svelte';
  import { extensionsConfig } from './extensionsConfig.js';
  import type { Extension } from './extensionsConfig.js';
  import AmplicaAccess from './icons/AmplicaAccess.svelte';

  export let extensions: Array<Extension> = [];

  onMount(async () => {
    extensions = extensionsConfig;
    console.log({ extensions });
  });

  async function handleSelectedWallet(injectedName: string) {
    alert(`Selected wallet: ${injectedName}`);
  }

  function handleAmplicaAccess() {
    alert('Signing in with Amplica Access...');
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
  <div class="mx-auto mt-8 text-4xl">OR</div>
  <button type="button" class="btn-banner font-bold" on:click={() => handleAmplicaAccess()}>
    <div class="flex justify-evenly">
      <AmplicaAccess />
      <div class="my-auto text-2xl">Sign in with Amplica Access</div>
    </div>
  </button>
</div>
