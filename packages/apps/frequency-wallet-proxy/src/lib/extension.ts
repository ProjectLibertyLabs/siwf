import type { InjectedWindowProvider, InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';

export class WalletConnector {
  private injectedWeb3: Record<string, InjectedWindowProvider>;

  constructor(injectedWeb3: Record<string, InjectedWindowProvider>) {
    this.injectedWeb3 = injectedWeb3;
  }

  async connectExtension(injectedName: string, originName: string): Promise<InjectedExtension> {
    const wallet = this.injectedWeb3?.[injectedName];

    if (!wallet) {
      throw new Error(`Wallet extension ${injectedName} not found`);
    }

    if (wallet.enable) {
      const res = await wallet.enable(originName);
      return {
        ...res,
        name: injectedName,
        version: wallet.version || '',
      };
    }

    if (wallet.connect) {
      return await wallet.connect(originName);
    }

    throw new Error('No connect(..) or enable(...) hook found');
  }

  async requestAccountsFor(walletName: string, requesterName: string): Promise<Array<InjectedAccount>> {
    try {
      const extension = await this.connectExtension(walletName, requesterName);
      return await extension.accounts.get();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
