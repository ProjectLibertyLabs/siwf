<script lang="ts">
  import type { InjectedAccountWithExtensions } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { formatWalletAddress } from '@frequency-control-panel/utils';

  export let selectShown: boolean = true;
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

    if (selectShown) {
      selectedAddress = _selectedAddress;
      if (account) {
        _selectedAccount = account;
        selectedAccount = account;
      }
    }
  }

  $: if (!_selectedAddress) {
    _selectedAddress = initialSelectedAddress || accounts?.[0]?.address;
  }
</script>

{#if selectShown}
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
  <span class="text-sm font-semibold">{label}</span>
{/if}
