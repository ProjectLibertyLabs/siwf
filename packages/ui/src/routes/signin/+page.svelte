<script lang="ts">
  import {
    ConnectionError,
    ExtensionConnector,
    ExtensionErrorEnum,
    isExtensionInstalled,
  } from '@AmplicaLabs/siwf-utils';
  import { WalletSelector } from '$lib/components';
  import type { WalletSelectedEvent } from '$lib/types/events';
  import { APP_NAME } from '$lib/globals';
  import { CachedExtensionsStore, ExtensionAuthorizationEnum } from '$lib/stores/CachedExtensionsStore';
  import { extensionsConfig } from '$lib/components';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { goto } from '$app/navigation';
  import { FilteredMsaAccountsDerivedStore } from '$lib/stores/derived/MsaAccountsDerivedStore';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleSelectedWallet = async (event: WalletSelectedEvent) => {
    const { injectedName } = event.detail;

    const cachedExt = $CachedExtensionsStore[injectedName];

    if (cachedExt.installed) {
      const connector = new ExtensionConnector(window.injectedWeb3!, APP_NAME);
      try {
        await connector.connect(injectedName);
        cachedExt.authorized = ExtensionAuthorizationEnum.Authorized;
        CachedExtensionsStore.updateExtension(cachedExt);
      } catch (error: unknown) {
        cachedExt.authorized = ExtensionAuthorizationEnum.None;
        if (error instanceof ConnectionError) {
          switch (error.reason) {
            case ExtensionErrorEnum.NO_EXTENSION:
              cachedExt.installed = false;
              break;
            case ExtensionErrorEnum.UNKNOWN:
            case ExtensionErrorEnum.PENDING_AUTH:
              cachedExt.authorized = ExtensionAuthorizationEnum.None;
              break;
            case ExtensionErrorEnum.UNAUTHORIZED:
            case ExtensionErrorEnum.NO_ACCOUNTS_AUTHORIZED:
              cachedExt.authorized = ExtensionAuthorizationEnum.Rejected;
              break;
          }
        }
        const message = getErrorMessage(error);
        console.error(message);
        CachedExtensionsStore.updateExtension(cachedExt);
      }
    } else {
      if (isExtensionInstalled(injectedName)) {
        cachedExt.installed = true;
        CachedExtensionsStore.updateExtension(cachedExt);
      } else if (extensionsConfig?.[injectedName]?.downloadUrl?.browser) {
        window.open(extensionsConfig[injectedName].downloadUrl.browser, '_blank');
      }
    }

    if (cachedExt.installed && cachedExt.authorized === ExtensionAuthorizationEnum.Authorized) {
      CurrentSelectedExtensionIdStore.set(cachedExt.injectedName);
      if (Object.keys($FilteredMsaAccountsDerivedStore).length === 0) {
        goto(`${base}/signup/handle?${$page.url.searchParams}`);
      } else {
        goto(`${base}/signin/accounts`);
      }
    }
  };
</script>

<div class=" pb-[84px] text-center text-[16px] font-bold">Connect your wallet</div>
<div class="pb-[17px] text-center text-sm font-bold">Select a wallet from this list</div>
<WalletSelector onSelectedWallet={handleSelectedWallet} extensions={Object.values(extensionsConfig)} />
