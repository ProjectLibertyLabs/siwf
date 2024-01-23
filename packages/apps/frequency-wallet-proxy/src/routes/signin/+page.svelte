<script lang="ts">
  import { WalletSelector } from '$lib/components';
  import { SelectedExtensionAccountsStore, filteredMsaAccountsStore } from '$lib/store';
  import { ExtensionConnector } from '@frequency-control-panel/utils';
  import { getMsaInfo } from '@frequency-control-panel/utils';
  import { goto } from '$app/navigation';
  import type { AccountWithMsaInfo } from '$lib/store';
  import type { Extension } from '$lib/components';
  import type { InjectedAccount } from '@polkadot/extension-inject/types';
  import type { InjectedWeb3 } from '@frequency-control-panel/utils';

  const handleSelectedWallet = async (event: CustomEvent) => {
    const extension: Extension = event.detail;
    const { injectedName } = extension;

    if (extension.installed) {
      const selectedExtensionAccounts = await getSelectedExtensionAccounts(injectedName);
      const augmentedWithMsaInfo = await getAugmentedWithMsaInfo(selectedExtensionAccounts);

      SelectedExtensionAccountsStore.set(augmentedWithMsaInfo);

      if ($filteredMsaAccountsStore.length > 0) {
        goto(`/accounts`);
      } else {
        console.log('no accounts with msa info - navigate to sign-up');
      }
    }
  };

  const getSelectedExtensionAccounts = async (injectedName: string): Promise<InjectedAccount[]> => {
    const extensionConnector = new ExtensionConnector(window.injectedWeb3 as InjectedWeb3, 'acme app');
    await extensionConnector.connect(injectedName);
    return await extensionConnector.getAccounts();
  };

  const getAugmentedWithMsaInfo = async (
    selectedExtensionAccounts: InjectedAccount[]
  ): Promise<AccountWithMsaInfo[]> => {
    const augmentedWithMsaInfo: AccountWithMsaInfo[] = await Promise.all(
      selectedExtensionAccounts.map(async (account: InjectedAccount) => {
        const msaInfo = await getMsaInfo(account.address);
        return { ...account, msaInfo };
      })
    );

    return augmentedWithMsaInfo;
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} />
