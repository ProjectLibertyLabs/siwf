<script lang="ts">
  import { FilteredMsaAccountsDerivedStore } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { goto } from '$app/navigation';
  import {
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
  } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import MsaAndAccountSelector from '$lib/components/MsaAndAccountSelector.svelte';
  import FooterButton from '$lib/components/FooterButton.svelte';

  let selectedMsaWithAccount: CurrentSelectedMsaAccount;

  $: nextEnabled = !!selectedMsaWithAccount;

  $: {
    $CurrentSelectedMsaAccountStore = selectedMsaWithAccount;
  }

  function handleNext() {
    if (nextEnabled) {
      goto('/signin/confirm');
    } else {
      console.error('Button not enabled');
    }
  }
</script>

<div class="flex h-full items-center justify-center pb-9">
  <span class=" text-[16px] font-bold">Choose a handle to sign in with</span>
</div>
<div class="pb-[64px]">
  <MsaAndAccountSelector
    msaEntries={Object.values($FilteredMsaAccountsDerivedStore)}
    bind:selectedMsaWithAccount
    initialSelection={{ msaId: '', address: '' }}
  />
</div>
<FooterButton on:click={handleNext}>Next > Sign In</FooterButton>
<div class="flex items-center justify-center pt-8">
  <a href="/signup/handle" class="text-center text-sm font-semibold">Create an account</a>
</div>
