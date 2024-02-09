<script lang="ts">
  import { goto } from '$app/navigation';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { type AccountMap } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { FilteredAccountsDerivedStore } from '$lib/stores/derived/FilteredAccountsDerivedStore';

  let accountMap: AccountMap = {};

  $: $FilteredAccountsDerivedStore.then((value) => {
    accountMap = value;
  });

  $: $SignupStore.address = Object.keys(accountMap)?.[0] ?? '';
</script>

<div>Sign up</div>
<div>Choose an address you want to create an account with</div>

<div>
  <div>
    {#each Object.entries(accountMap) as [address, account]}
      <div>
        <input type="radio" bind:group={$SignupStore.address} value={address} id={address} />
        <label for={address}> {address} ({account.name})</label>
      </div>
    {/each}
  </div>

  <div>
    <button on:click={() => goto('/signin')}>back</button>
    <button on:click={() => goto('/handle')}>next</button>
  </div>
</div>
