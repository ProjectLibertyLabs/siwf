import type { InjectedWindowProvider, InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';

export interface InjectedWeb3 {
  [key: string]: InjectedWindowProvider;
}

export class ExtensionConnector {
  private injectedWeb3: InjectedWeb3;
  private appName: string;
  private extension?: InjectedExtension;

  constructor(injectedWeb3: InjectedWeb3) {
    this.injectedWeb3 = injectedWeb3;
    this.appName = '';
  }

  public async connect(injectedName: string): Promise<InjectedExtension> {
    const wallet = this.injectedWeb3[injectedName];

    if (!wallet) {
      throw new Error(`Wallet extension ${injectedName} not found`);
    }

    if (wallet.enable) {
      const res = await wallet.enable(this.appName);
      this.extension = {
        ...res,
        name: injectedName,
        version: wallet.version || '',
      };

      return this.extension;
    }

    if (wallet.connect) {
      this.extension = await wallet.connect(this.appName);
      return this.extension;
    }

    throw new Error('No connect(..) or enable(...) hook found');
  }

  public async getAccounts(): Promise<Array<InjectedAccount>> {
    if (!this.extension) {
      throw new Error(`Wallet extension connection not found`);
    }

    try {
      return await this.extension.accounts.get();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to request accounts', { cause: error });
    }
  }
}
