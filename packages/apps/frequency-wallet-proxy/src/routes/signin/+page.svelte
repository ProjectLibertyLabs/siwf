<script lang="ts">
  import { type InjectedAccountWithExtensions } from '$lib/stores';
  import type { MsaInfoWithAccounts } from '$lib/stores/MsaAccountsStore';
  import { goto } from '$app/navigation';
  import {
    CachedExtensionsStore,
    type CurrentSelectedMsaAccount,
    CurrentSelectedMsaAccountStore,
    ExtensionAuthorizationEnum,
    MsaAccountsStore,
    MsaMap,
  } from '$lib/stores';
  import sharpSettings from '@iconify/icons-ic/sharp-settings';
  import Icon from '@iconify/svelte';

  let userSelected: CurrentSelectedMsaAccount;
  let msaMap: MsaMap = new MsaMap();

  $: $MsaAccountsStore.then((value) => {
    msaMap = value;
  });

  $: if (
    [...$CachedExtensionsStore.values()].every(
      (ext) => !ext.installed || ext.authorized !== ExtensionAuthorizationEnum.Authorized
    )
  ) {
    goto('/manage_wallets');
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

  <span>
    <button on:click={() => goto('/signin')}>back</button>
    <button on:click={() => goto('/signup')}>Create new account</button>
    <button on:click={() => goto('/confirm_siwx')}>next</button>
  </span>
</div>
