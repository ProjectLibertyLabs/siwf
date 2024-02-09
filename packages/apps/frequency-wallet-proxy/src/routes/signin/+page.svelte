<script lang="ts">
  import { type InjectedAccountWithExtensions } from '$lib/stores/derived/AccountsStore';
  import { MsaAccountsDerivedStore, type MsaMap } from '$lib/stores/derived/MsaAccountsStore';
  import type { MsaInfoWithAccounts } from '$lib/stores/derived/MsaAccountsStore';
  import { goto } from '$app/navigation';
  import sharpSettings from '@iconify/icons-ic/sharp-settings';
  import Icon from '@iconify/svelte';
  import {
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
  } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import { ConnectedExtensionsDerivedStore } from '$lib/stores/derived/ConnectedExtensionsStore';

  let userSelected: CurrentSelectedMsaAccount;
  let msaMap: MsaMap = {};

  $: $MsaAccountsDerivedStore.then((value) => {
    msaMap = value;
  });

  $: {
    $ConnectedExtensionsDerivedStore &&
      $ConnectedExtensionsDerivedStore.then((map) => {
        if (Object.keys(map).length === 0) {
          goto('/manage_wallets');
        }
      });
  }

  $: {
    $CurrentSelectedMsaAccountStore = userSelected;
  }

  function createSelectedMsaAccount(msaInfoWithAccounts: MsaInfoWithAccounts, account: InjectedAccountWithExtensions) {
    const { accounts: _msaAccounts, ...msaInfo } = msaInfoWithAccounts;
    return { ...msaInfo, account };
  }
</script>

<div>
  <div>
    <button on:click={() => goto('/manage_wallets')}>
      <Icon icon={sharpSettings} width="30" height="30" />
    </button>
  </div>
  <div>
    <ul>
      {#each Object.entries(msaMap) as [msaId, msaInfo]}
        <div>
          <div>
            {msaInfo.handle} msaId: {msaId}
          </div>
          <div>
            {#each Object.entries(msaInfo.accounts) as [address, account]}
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
          <div style="height:20px" />
        </div>
      {/each}
    </ul>
  </div>

  <span>
    <button on:click={() => goto('/signin')}>back</button>
    <button on:click={() => goto('/signup')}>Create new account</button>
    <button on:click={() => goto('/confirm_siwx')}>next</button>
  </span>
</div>
