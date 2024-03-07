<script lang="ts">
  import { type InjectedAccountWithExtensions } from '$lib/stores/derived/AllAccountsDerivedStore';
  import type { MsaInfoWithAccounts } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { type CurrentSelectedMsaAccount } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import { getHandleBase, getHandleSuffix } from '@frequency-control-panel/utils';
  import WalletAddressSelector from './WalletAddressSelector.svelte';
  import type { MsaAndAddress } from '$lib/stores/CachedLastUsedMsaAndAddressStore';

  export let msaEntries: MsaInfoWithAccounts[] = [];
  export let selectedMsaWithAccount: CurrentSelectedMsaAccount;
  export let initialSelection: MsaAndAddress;
  let selectedMsa: string;
  let selectedAccount: InjectedAccountWithExtensions;
  let selectedAddress: string;

  function createSelectedMsa(msaId: string, account: InjectedAccountWithExtensions) {
    const msaWithAccounts = msaEntries.find((msa) => msa.msaId === msaId);
    if (msaWithAccounts) {
      const { accounts: _accounts, ...msaInfo } = msaWithAccounts;
      selectedMsaWithAccount = {
        ...msaInfo,
        account,
      };
    }
  }

  $: if (selectedMsa && selectedAccount) {
    createSelectedMsa(selectedMsa, selectedAccount);
  }

  $: if (!selectedMsaWithAccount && msaEntries.length > 0) {
    let msa: MsaInfoWithAccounts = msaEntries[0];
    let account = Object.values(msa.accounts)[0];
    if (initialSelection) {
      msa = msaEntries.find((msa) => msa.msaId === initialSelection?.msaId) || msa;
      account = msa.accounts?.[initialSelection.address] || Object.values(msa.accounts)[0];
    }
    selectedMsa = msa.msaId;
    createSelectedMsa(selectedMsa, account);
  }
</script>

<div class="flex h-[400px] w-full flex-col overflow-auto bg-transparent">
  <ul>
    {#each msaEntries as msaInfo}
      <label class="text-base font-semibold">
        <input type="radio" name="msa" bind:group={selectedMsa} value={msaInfo.msaId} />
        <span class="text-white">{getHandleBase(msaInfo.handle)}</span><span class="text-neutral-400"
          >.{getHandleSuffix(msaInfo.handle)}</span
        ><span class="pl-5 text-white"> (MSA {msaInfo.msaId})</span></label
      >
      <div class="pl-5">
        <WalletAddressSelector
          active={msaInfo.msaId === selectedMsa}
          accounts={Object.values(msaInfo.accounts)}
          initialSelectedAddress={initialSelection?.address || Object.keys(msaInfo.accounts)[0]}
          bind:selectedAddress
          bind:selectedAccount
        />
      </div>
      <div class="flex items-center pb-5 pt-3">
        <hr class="flex-grow" />
      </div>
    {/each}
  </ul>
</div>
