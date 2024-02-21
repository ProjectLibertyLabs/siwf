<script lang="ts">
  import { FilteredMsaAccountsDerivedStore, type MsaMap } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { goto } from '$app/navigation';
  import {
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
  } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import MsaAndAccountSelector from '$lib/components/MsaAndAccountSelector.svelte';

  let selectedMsaWithAccount: CurrentSelectedMsaAccount;
  let msaMap: MsaMap = {};

  $: nextEnabled = !!selectedMsaWithAccount;

  $: $FilteredMsaAccountsDerivedStore.then((value) => {
    msaMap = value;
  });

  $: {
    $CurrentSelectedMsaAccountStore = selectedMsaWithAccount;
  }

  function handleNext() {
    if (nextEnabled) {
      goto('/confirm_siwx');
    } else {
      console.error('Button not enabled');
    }
  }

  function handleKeyPress() {}
</script>

<div class="pb-[64px]">
  <MsaAndAccountSelector
    msaEntries={Object.values(msaMap)}
    bind:selectedMsaWithAccount
    initialSelection={{ msaId: '3', address: '5C4naHLqrqJbKQL7BFnFNHzwj3PMtffFWXYNoMgVYUq2Faj8' }}
  />
</div>
<div class="flex h-full items-center justify-center">
  <div
    class="flex h-[40px] w-[235px] items-center justify-center rounded-[50px] bg-[#1B9EA3] pl-2 pr-2"
    on:click={handleNext}
    role="button"
    tabindex="0"
    on:keypress={handleKeyPress}
  >
    <span class="text-center text-base font-bold">Next > Sign In</span>
  </div>
</div>
<div class="flex items-center justify-center pt-8">
  <a href="/signup/handle" class="text-center text-sm font-semibold">Create an account</a>
</div>
