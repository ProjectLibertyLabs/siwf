<script lang="ts">
  import type { Extension } from '@frequency-control-panel/components';
  import { WalletSelector } from '@frequency-control-panel/components';
  import { WalletConnector } from '$lib';

  const handleSelectedWallet = async (event: CustomEvent) => {
    const extension: Extension = event.detail;
    const { injectedName } = extension;
    if (extension.installed) {
      const walletConnector = new WalletConnector(window.injectedWeb3);
      await walletConnector.connectExtension(injectedName);
      await walletConnector.requestAccountsFor(injectedName, 'acme app');
    }
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} />
