import type { InjectedWindowProvider, InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';

export interface InjectedWeb3 {
  [key: string]: InjectedWindowProvider;
}

export class ExtensionConnector {
  private injectedWeb3: InjectedWeb3;
  private appName: string;

  constructor(injectedWeb3: InjectedWeb3) {
    this.injectedWeb3 = injectedWeb3;
    this.appName = '';
  }

  public async connectExtension(injectedName: string, originName: string): Promise<InjectedExtension> {
    this.appName = originName;
    const wallet = this.injectedWeb3[injectedName];

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

  public async requestAccountsFor(walletName: string): Promise<Array<InjectedAccount>> {
    try {
      const extension = await this.connectExtension(walletName, this.appName);
      return await extension.accounts.get();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to request accounts', { cause: error });
    }
  }
}
