<script lang="ts">
  import { WalletSelector } from '@frequency-control-panel/components';
  import { WalletConnector } from '$lib';

  const handleSelectedWallet = async (injectedName: string) => {
    const walletConnector = new WalletConnector(window.injectedWeb3);
    await walletConnector.connectExtension(injectedName);
    await walletConnector.requestAccountsFor(injectedName, 'acme app');
  };
</script>

<WalletSelector onSelectedWallet={handleSelectedWallet} />
