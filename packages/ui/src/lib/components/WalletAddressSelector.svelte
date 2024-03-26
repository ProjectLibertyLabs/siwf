<script lang="ts">
  import type { InjectedAccountWithExtensions } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { formatWalletAddress } from '@amplica-labs/siwf-utils';
  import checkIcon from '@iconify/icons-mdi/check';
  import Icon from '@iconify/svelte';

  export let active: boolean = true;
  export let accounts: InjectedAccountWithExtensions[] = [];
  export let initialSelectedAddress: string = '';

  // Pattern for read-only properties: hide the internal, writable
  // property behind a private shadow property.
  export let selectedAddress: string;
  let _selectedAddress: string;
  export let selectedAccount: InjectedAccountWithExtensions;
  let _selectedAccount: InjectedAccountWithExtensions;

  let label: string;

  function formatAccount(account: InjectedAccountWithExtensions) {
    return `${account.name} - ${formatWalletAddress(account.address)}`;
  }

  $: {
    const account = accounts.find((acc) => acc.address === _selectedAddress);
    if (account) {
      label = formatAccount(account);
    } else {
      label = '<no address selected>';
    }

    if (active) {
      selectedAddress = _selectedAddress;
      if (account) {
        _selectedAccount = account;
        selectedAccount = account;
      }
    }
  }

  $: if (!_selectedAddress) {
    if (initialSelectedAddress && accounts.find((account) => account.address === initialSelectedAddress)) {
      _selectedAddress = initialSelectedAddress;
    } else {
      _selectedAddress = accounts?.[0]?.address;
    }
  }
</script>

{#if active && accounts.length > 1}
  <div class="bg-button w-full rounded-md border border-white bg-opacity-25">
    <select class="bg-button bg-opacity-25 text-sm font-semibold text-white" bind:value={_selectedAddress}>
      {#each accounts as account}
        <option
          class=" bg-button border-white bg-opacity-25 text-sm font-semibold text-red-700"
          value={account.address}
        >
          {formatAccount(account)}
        </option>
      {/each}
    </select>
  </div>
{:else}
  <div class="flow-root">
    <div>
      <span class="float-left text-sm font-semibold">{label}</span>
    </div>
    {#if active}
      <div class=" float-right mr-2"><Icon icon={checkIcon} /></div>
    {/if}
  </div>
{/if}
