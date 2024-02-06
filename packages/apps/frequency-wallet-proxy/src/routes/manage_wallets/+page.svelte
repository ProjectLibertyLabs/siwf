<script lang="ts">
  import { ExtensionConnector, getMsaInfo } from '@frequency-control-panel/utils';
  import type { InjectedAccount } from '@polkadot/extension-inject/types';
  import type { InjectedWeb3 } from '@frequency-control-panel/utils';
  import { type AccountWithMsaInfo, WalletSelector } from '$lib/components';
  import {
    CachedExtensionsStore,
    CurrentSelectedExtensionIdStore,
    ExtensionAuthorizationEnum,
    ExtensionsStore,
  } from '$lib/stores';
  import { goto, afterNavigate } from '$app/navigation';
  import type { WalletSelectedEvent } from '$lib/types/events';
  import { base } from '$app/paths';
  import { APP_NAME } from '$lib/globals';

  let previousPage: string = base;

  afterNavigate(({ from }) => {
    previousPage = from?.url?.pathname || previousPage;
  });

  function goBack() {
    goto(previousPage);
  }

  const handleSelectedWallet = async (event: WalletSelectedEvent) => {
    const { extension, extensionAuth } = event.detail;
    $CurrentSelectedExtensionIdStore = extension.injectedName;

    if (extensionAuth.installed) {
      const extensionConnector = new ExtensionConnector(window.injectedWeb3 as InjectedWeb3, APP_NAME);
      try {
        await extensionConnector.connect(extension.injectedName);

        extension.connector = extensionConnector;
        extensionAuth.authorized = ExtensionAuthorizationEnum.Authorized;
        ExtensionsStore.updateExtension(extension);
        CachedExtensionsStore.updateExtension(extensionAuth);
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(message);
        extensionAuth.authorized = ExtensionAuthorizationEnum.Rejected;
        CachedExtensionsStore.updateExtension(extensionAuth);
      }
    }
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
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

<WalletSelector onSelectedWallet={handleSelectedWallet} extensions={Object.values($ExtensionsStore)} />
<button on:click={goBack}>Back</button>
