<script lang="ts">
  import type { Extension } from '$lib/components';
  import { WalletSelector } from '$lib/components';
  import { ExtensionConnector } from '@frequency-control-panel/utils';
  import type { InjectedWeb3 } from '@frequency-control-panel/utils';

  const handleSelectedWallet = async (event: CustomEvent) => {
    const extension: Extension = event.detail;
    const { injectedName } = extension;
    if (extension.installed) {
      const extensionConnector = new ExtensionConnector(window.injectedWeb3 as InjectedWeb3, 'acme app');
      await extensionConnector.connect(injectedName);
      await extensionConnector.getAccounts();
    }
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} />
