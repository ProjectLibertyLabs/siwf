<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { goto } from '$app/navigation';
  import HandleInput from '$lib/components/HandleInput.svelte';
  import WalletAddressSelector from '$lib/components/WalletAddressSelector.svelte';
  import type { InjectedAccountWithExtensions } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { FilteredNonMsaAccountsDerivedStore } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import FooterButton from '$lib/components/FooterButton.svelte';
  import { getHandlePayload } from '$lib/utils';

  let selectedAddress: string;
  let selectedAccount: InjectedAccountWithExtensions;
  let isNextDisabled: boolean = true;
  let accounts: InjectedAccountWithExtensions[];

  $: {
    const { address, handle } = $SignupStore;
    isNextDisabled = !address || !handle.isValid || !handle.isAvailable;
  }

  $: $SignupStore.address = selectedAddress;

  $: $FilteredNonMsaAccountsDerivedStore.then((allAccounts) => {
    accounts = Object.values(allAccounts);
  });

  async function handleNext() {
    const payload = await getHandlePayload($SignupStore.handle.baseHandle);
    $SignupStore.handle.payload = payload;
    goto('/signup/handle-confirmation');
  }
</script>

<div>
  <div class="flex items-center justify-center pb-9">
    <span class=" text-[16px] font-bold">Claim your handle</span>
  </div>
  <div class=" flex-col">
    <div class="flex">Select a key to associate with a handle</div>
    <div class="flex pb-9">
      <WalletAddressSelector {accounts} bind:selectedAccount bind:selectedAddress />
    </div>
    <div class="flex pb-6">
      <span class=" text-sm font-bold">Claim your handle:</span>
    </div>
    <div class="flex-col pb-3">
      <HandleInput />
      <div class="flex w-full border-t border-white"></div>
    </div>
    <div class=" flex w-full pb-8">
      <span class=" text-xs font-normal"
        >Handle must be between 3-20 characters & can only consist of letters, numbers, and underscores</span
      >
    </div>
  </div>
  <FooterButton bind:disabled={isNextDisabled} on:click={handleNext}>Next > Sign</FooterButton>
</div>
