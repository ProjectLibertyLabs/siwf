<script lang="ts">
  import { WalletSelector } from '$lib/components';
  import { ExtensionConnector } from '@frequency-control-panel/utils';
  import { getMsaInfo } from '@frequency-control-panel/utils';
  import { goto } from '$app/navigation';
  import { ExtensionAuthorization, type AccountWithMsaInfo } from '$lib/components';
  import type { InjectedAccount } from '@polkadot/extension-inject/types';
  import type { InjectedWeb3 } from '@frequency-control-panel/utils';
  import {
    ExtensionsStore,
    CurrentSelectedExtensionIdStore,
    CurrentSelectedFilteredMsaAccountsStore,
  } from '$lib/stores';

  const handleSelectedWallet = async (event: CustomEvent) => {
    const { extension } = event.detail;
    $CurrentSelectedExtensionIdStore = extension.injectedName;

    if (extension.installed) {
      try {
        const [extensionConnector, selectedExtensionAccounts] = await getSelectedExtensionAccounts(
          $CurrentSelectedExtensionIdStore
        );
        const augmentedWithMsaInfo = await getAugmentedWithMsaInfo(selectedExtensionAccounts);

        extension.connector = extensionConnector;
        extension.accounts = augmentedWithMsaInfo;
        extension.authorized = ExtensionAuthorization.Authorized;
        ExtensionsStore.updateExtension(extension);
        if (($CurrentSelectedFilteredMsaAccountsStore || []).length > 0) {
          goto(`/accounts`);
        } else {
          goto(`/signup`);
        }
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        if (/not_authorized/.test(message) || /pending_authorization/.test(message)) {
          extension.authorized = ExtensionAuthorization.Rejected;
          ExtensionsStore.updateExtension(extension);
        }
      }
    }
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const getSelectedExtensionAccounts = async (
    injectedName: string
  ): Promise<[ExtensionConnector, InjectedAccount[]]> => {
    const extensionConnector = new ExtensionConnector(window.injectedWeb3 as InjectedWeb3, 'acme app');
    try {
      await extensionConnector.connect(injectedName);
      const accounts = await extensionConnector.getAccounts();
      return [extensionConnector, accounts];
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (
        /not allowed to interact with this extension/.test(message) ||
        /Failed to request accounts/.test(message) ||
        /Rejected/.test(message)
      ) {
        throw new Error('not_authorized');
      } else if (/has a pending authorization request/.test(message)) {
        throw new Error('pending_authorization');
      }

      throw error;
    }
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

<WalletSelector onSelectedWallet={handleSelectedWallet} extensions={$ExtensionsStore} />
