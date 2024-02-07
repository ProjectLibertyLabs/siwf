<script lang="ts">
  import { ExtensionConnector, isExtensionInstalled } from '@frequency-control-panel/utils';
  import { WalletSelector } from '$lib/components';
  import { CachedExtensionsStore, ConfiguredExtensionsStore, ExtensionAuthorizationEnum } from '$lib/stores';
  import { afterNavigate, goto } from '$app/navigation';
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

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleSelectedWallet = async (event: WalletSelectedEvent) => {
    const { extension, extensionAuth } = event.detail;

    if (extensionAuth.installed) {
      const connector = new ExtensionConnector(window.injectedWeb3!, APP_NAME);
      switch (extensionAuth.authorized) {
        case ExtensionAuthorizationEnum.None:
        case ExtensionAuthorizationEnum.Rejected:
          try {
            await connector.connect(extension.injectedName);
            extensionAuth.authorized = ExtensionAuthorizationEnum.Authorized;
            CachedExtensionsStore.updateExtension(extensionAuth);
          } catch (error: unknown) {
            const message = getErrorMessage(error);
            console.error(message);
            extensionAuth.authorized = ExtensionAuthorizationEnum.Rejected;
            CachedExtensionsStore.updateExtension(extensionAuth);
          }
          break;

        case ExtensionAuthorizationEnum.Authorized:
          break;
      }
    } else {
      if (isExtensionInstalled(extension.injectedName)) {
        extensionAuth.installed = true;
        CachedExtensionsStore.updateExtension(extensionAuth);
      } else {
        window.open(extension.downloadUrl, '_blank');
      }
    }
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} extensions={Object.values($ConfiguredExtensionsStore)} />
<button on:click={goBack}>Back</button>
