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

  function createSelectedMsa(msaId: string, account: InjectedAccountWithExtensions): CurrentSelectedMsaAccount {
    let selectedValue: CurrentSelectedMsaAccount;
    const msaWithAccounts = msaEntries.find((msa) => msa.msaId === msaId);
    if (msaWithAccounts) {
      const { accounts: _accounts, ...msaInfo } = msaWithAccounts;
      selectedValue = {
        ...msaInfo,
        account,
      };
    } else {
      selectedValue = {
        msaId: '',
        handle: '',
        account,
      };
    }

    return selectedValue;
  }

  $: {
    selectedMsaWithAccount = createSelectedMsa(selectedMsa, selectedAccount);
  }

  $: if (!selectedMsa) {
    if (initialSelection && msaEntries.find((msa) => msa.msaId === initialSelection?.msaId)) {
      selectedMsa = initialSelection.msaId;
    } else if (msaEntries.length > 0) {
      selectedMsa = msaEntries[0].msaId;
    }
  }
</script>

<div>
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
