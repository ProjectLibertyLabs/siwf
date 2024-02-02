<script lang="ts">
  import { type InjectedAccountWithExtensions } from '$lib/stores/derived/AllAccountsDerivedStore';
  import { FilteredMsaAccountsDerivedStore, type MsaMap } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import type { MsaInfoWithAccounts } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { goto } from '$app/navigation';
  import sharpSettings from '@iconify/icons-ic/sharp-settings';
  import Icon from '@iconify/svelte';
  import {
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
  } from '$lib/stores/CurrentSelectedMsaAccountStore';

  let userSelected: CurrentSelectedMsaAccount;
  let msaMap: MsaMap = {};

  $: $FilteredMsaAccountsDerivedStore.then((value) => {
    msaMap = value;
  });

  $: {
    $CurrentSelectedMsaAccountStore = userSelected;
  }

  function createSelectedMsaAccount(msaInfoWithAccounts: MsaInfoWithAccounts, account: InjectedAccountWithExtensions) {
    const { ...msaInfo } = msaInfoWithAccounts;
    return { ...msaInfo, account };
  }
</script>

<div>
  <div>
    <button on:click={() => goto('/signin')}>
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
