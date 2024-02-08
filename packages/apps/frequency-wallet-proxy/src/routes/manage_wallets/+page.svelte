<script lang="ts">
  import {
    ConnectionError,
    ExtensionConnector,
    ExtensionErrorEnum,
    isExtensionInstalled,
  } from '@frequency-control-panel/utils';
  import { WalletSelector } from '$lib/components';
  import type { WalletSelectedEvent } from '$lib/types/events';
  import { APP_NAME } from '$lib/globals';
  import { ExtensionAuthorizationEnum, CachedExtensionsStore } from '$lib/stores/CachedExtensionsStore';
  import { ConfiguredExtensionsStore } from '$lib/stores/ConfiguredExtensionsStore';

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleSelectedWallet = async (event: WalletSelectedEvent) => {
    const { extension, extensionAuth } = event.detail;

    if (extensionAuth.installed) {
      const connector = new ExtensionConnector(window.injectedWeb3!, APP_NAME);
      try {
        await connector.connect(extension.injectedName);
        extensionAuth.authorized = ExtensionAuthorizationEnum.Authorized;
        CachedExtensionsStore.updateExtension(extensionAuth);
      } catch (error: unknown) {
        extensionAuth.authorized = ExtensionAuthorizationEnum.None;
        if (error instanceof ConnectionError) {
          switch (error.reason) {
            case ExtensionErrorEnum.NO_EXTENSION:
              extensionAuth.installed = false;
              break;
            case ExtensionErrorEnum.UNKNOWN:
            case ExtensionErrorEnum.PENDING_AUTH:
              extensionAuth.authorized = ExtensionAuthorizationEnum.None;
              break;
            case ExtensionErrorEnum.UNAUTHORIZED:
            case ExtensionErrorEnum.NO_ACCOUNTS_AUTHORIZED:
              extensionAuth.authorized = ExtensionAuthorizationEnum.Rejected;
              break;
          }
        }
        const message = getErrorMessage(error);
        console.error(message);
        CachedExtensionsStore.updateExtension(extensionAuth);
      }
    } else {
      if (isExtensionInstalled(extension.injectedName)) {
        extensionAuth.installed = true;
        CachedExtensionsStore.updateExtension(extensionAuth);
      }
    }
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} extensions={Object.values($ConfiguredExtensionsStore)} />
