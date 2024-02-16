<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { FilteredAccountsDerivedStore } from '$lib/stores/derived/FilteredAccountsDerivedStore';
  import { type AccountMap } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { onMount } from 'svelte';

  let accountMap: AccountMap = {};
  onMount(async () => {
    accountMap = await $FilteredAccountsDerivedStore;
    const firstAddress = Object.keys(accountMap)?.[0];
    SignupStore.updateAddress(firstAddress);
  });
</script>

<select bind:value={$SignupStore.address}>
  {#each Object.entries(accountMap) as [address, account]}
    <option value={address}>{address} ({account.name})</option>
  {/each}
</select>
