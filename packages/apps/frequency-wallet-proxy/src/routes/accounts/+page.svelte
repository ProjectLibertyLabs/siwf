<script lang="ts">
  import { goto } from '$app/navigation';
  import type { AccountWithMsaInfo } from '$lib/components';
  import { groupByMsaIdStore, CurrentSelectedAccountWithMsaStore, CurrentSelectedExtensionStore } from '$lib/store';
  import { onMount } from 'svelte';

  let msaAccounts = Object.entries($groupByMsaIdStore);
  let userSelected: AccountWithMsaInfo = msaAccounts[0][1][0];

  $: $CurrentSelectedAccountWithMsaStore = userSelected;

  onMount(() => {
    if (!$CurrentSelectedExtensionStore?.connector?.injectedExtension) {
      goto('/signin');
    }
  });
</script>

<div>
  <div>
    {#each msaAccounts as [msaId, accounts]}
      <div>
        <div>
          {accounts[0].msaInfo.handle} msaId: {msaId}
        </div>
        <div>
          {#each accounts as account}
            <ul>
              <li>
                <input type="radio" bind:group={userSelected} value={account} id={account.address} />
                <label for={account.address}> {account.address} ({account.name})</label>
              </li>
            </ul>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <button on:click={() => goto('/signin')}>back</button>
  <button on:click={() => goto('/confirm_siwx')}>next</button>
</div>
