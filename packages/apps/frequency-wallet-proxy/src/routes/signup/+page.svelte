<script lang="ts">
  import { CurrentSelectedExtensionStore, SignupStore } from '$lib/stores';
  import { goto } from '$app/navigation';

  let accounts = $CurrentSelectedExtensionStore?.accounts || [];
  $SignupStore.address = accounts[0]?.address;
</script>

<div>Sign up</div>
<div>Choose an account you want to create an account with</div>

<div>
  <div>
    {#each accounts as account}
      <div>
        <input type="radio" bind:group={$SignupStore.address} value={account.address} id={account.address} />
        <label for={account.address}> {account.address} ({account.name})</label>
      </div>
    {/each}
  </div>

  <div>
    <button on:click={() => goto('/signin')}>back</button>
    <button on:click={() => goto('/handle')}>next</button>
  </div>
</div>
