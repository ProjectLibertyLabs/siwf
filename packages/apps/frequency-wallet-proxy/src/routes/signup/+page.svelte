<script lang="ts">
  import { goto } from '$app/navigation';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { AccountMap, AccountsDerivedStore } from '$lib/stores/derived/AccountsStore';

  let accountMap: AccountMap = new AccountMap();

  $: $AccountsDerivedStore.then((value) => {
    accountMap = value;
  });

  $: $SignupStore.address = [...accountMap.keys()]?.[0] ?? '';
</script>

<div>Sign up</div>
<div>Choose an address you want to create an account with</div>

<div>
  <div>
    {#each accountMap as [address, account]}
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
