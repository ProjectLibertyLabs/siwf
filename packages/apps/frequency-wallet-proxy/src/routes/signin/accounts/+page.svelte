<script lang="ts">
  import { FilteredMsaAccountsDerivedStore } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { goto } from '$app/navigation';
  import {
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
  } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import MsaAndAccountSelector from '$lib/components/MsaAndAccountSelector.svelte';
  import FooterButton from '$lib/components/FooterButton.svelte';
  import { CachedLastUsedMsaAndAddressStore, type MsaAndAddress } from '$lib/stores/CachedLastUsedMsaAndAddressStore';
  import { onMount } from 'svelte';

  let selectedMsaWithAccount: CurrentSelectedMsaAccount;
  let initialSelection: MsaAndAddress;

  $: nextEnabled = !!selectedMsaWithAccount;

  $: {
    $CurrentSelectedMsaAccountStore = selectedMsaWithAccount;
  }

  function handleNext() {
    if (nextEnabled) {
      $CachedLastUsedMsaAndAddressStore = {
        msaId: selectedMsaWithAccount.msaId,
        address: selectedMsaWithAccount.account.address,
      };
      goto('/signin/confirm');
    } else {
      console.error('Button not enabled');
    }
  }

  onMount(() => {
    if ($CachedLastUsedMsaAndAddressStore) {
      initialSelection = $CachedLastUsedMsaAndAddressStore;
    }
  });
</script>

<div class="flex h-full items-center justify-center pb-9">
  <span class=" text-[16px] font-bold">Choose a handle to sign in with</span>
</div>
<div class="pb-[64px]">
  <MsaAndAccountSelector
    msaEntries={Object.values($FilteredMsaAccountsDerivedStore)}
    bind:selectedMsaWithAccount
    {initialSelection}
  />
</div>
<FooterButton on:click={handleNext}>Next > Sign In</FooterButton>
<div class="flex items-center justify-center pt-8">
  <a href="/signup/handle" class="text-center text-sm font-semibold">Create an account</a>
</div>
