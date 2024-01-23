<script lang="ts">
  import { goto } from '$app/navigation';
  import { groupByMsaIdStore, type AccountWithMsaInfo } from '$lib/store';

  let msaAccounts = Object.entries($groupByMsaIdStore);
  let userSelected: [string, AccountWithMsaInfo[]][] = msaAccounts[0][1][0].address;
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
            <input type="radio" bind:group={userSelected} value={account.address} id={account.address} />
            <label for={account.address}> {account.address} ({account.name})</label>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <button on:click={() => goto('/signin')}>back</button>
</div>
