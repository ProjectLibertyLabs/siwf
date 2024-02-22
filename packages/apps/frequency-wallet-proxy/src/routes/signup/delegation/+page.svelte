<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { onMount } from 'svelte';
  import { DSNPSchemas, getDelegationAndPermissionSignature } from '$lib/utils';
  import type { SchemaData } from '$lib/utils';

  let schemas: [string, SchemaData][] = [];

  onMount(() => {
    let inputSchemas = $page.url.searchParams.get('schemas')?.split(',');

    schemas = (inputSchemas || [])
      .filter((inputSchema) => !!DSNPSchemas[inputSchema])
      .map((inputSchema) => [inputSchema, DSNPSchemas[inputSchema]]);
  });

  async function signDelegationAndPermissions() {
    const schemaIds: number[] = schemas.map((schema: [string, SchemaData]) => schema[1].id.mainnet as number);
    const _authorizedDelegationAndSchemas = await getDelegationAndPermissionSignature(
      $CurrentSelectedExtensionIdStore,
      $SignupStore.address,
      '1',
      schemaIds
    );
  }

  const toggleHelp = (evt: Event) => {
    let el = evt.target as HTMLElement;
    el.nextElementSibling?.classList.toggle('hidden');
  };
</script>

<div>Delegation Page</div>

<div class="mt-8 flex flex-wrap justify-start">
  {#each schemas as schema, _index}
    <ul class="m-2 p-2 underline">
      <li class="relative text-xl font-thin">
        {schema[0]}
        <span
          role="tooltip"
          class="text-aqua -t-2 hover:border-rounded absolute ml-1 cursor-pointer px-2 py-1 text-sm hover:rounded-xl hover:bg-white hover:text-black"
          on:mouseenter|preventDefault={toggleHelp}
          on:mouseleave|preventDefault={toggleHelp}>?</span
        >
        <p
          class="-bottom-80px border-rounded border-aqua text-md absolute z-40 hidden rounded-md bg-white p-4 leading-6 text-black"
        >
          {schema[1].description}
        </p>
      </li>
    </ul>
  {/each}
</div>
<div>
  <button on:click|preventDefault={signDelegationAndPermissions}>
    I Authorize <span class="font-bold text-white">Acme App</span>
  </button>
</div>

<div>
  <button on:click={() => goto(`/signup/handle?${$page.url.searchParams}`)}>back</button>
  <button on:click={() => goto(`/delegation?${$page.url.searchParams}`)}>next</button>
</div>
