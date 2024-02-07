<script lang="ts">
  import type { InjectedAccountWithExtensions } from '$lib/stores/ConnectedExtensionsStore';
  import type { MsaInfoWithAccounts } from '$lib/stores/MsaAccountsStore';
  import { goto } from '$app/navigation';
  import {
    CurrentSelectedMsaAccountStore,
    MsaAccountsStore,
    type CurrentSelectedMsaAccount,
    MsaMap,
  } from '$lib/stores';

  let userSelected: CurrentSelectedMsaAccount;
  let msaMap: MsaMap = new MsaMap();

  $: $MsaAccountsStore.then((value) => {
    msaMap = value;
  });

  $: $CurrentSelectedMsaAccountStore = userSelected;

  function createSelectedMsaAccount(msaInfoWithAccounts: MsaInfoWithAccounts, account: InjectedAccountWithExtensions) {
    const { accounts: msaAccounts, ...msaInfo } = msaInfoWithAccounts;
    return { ...msaInfo, account };
  }
</script>

<div>
  <div>
    {#each msaMap as [msaId, msaInfo]}
      <div>
        <div>
          {msaInfo.handle} msaId: {msaId}
        </div>
        <div>
          {#each msaInfo.accounts as [address, account]}
            <ul>
              <li>
                <input
                  type="radio"
                  bind:group={userSelected}
                  value={createSelectedMsaAccount(msaInfo, account)}
                  id={address}
                />
                <label for={address}> {address} ({account.name})</label>
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
