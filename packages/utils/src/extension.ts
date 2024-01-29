import type { InjectedWindowProvider, InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';
import { HexString } from '@polkadot/util/types';

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

  public get injectedExtension() {
    return this.extension;
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

  public async signMessage(message: string, address: string): Promise<HexString> {
    const signRaw = this.extension?.signer?.signRaw;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!signRaw) {
      // after making sure that signRaw is defined
      // we can use it to sign our message
      const { signature } = await signRaw({
        address,
        data: message,
        type: 'bytes',
      });

      return signature;
    }

    throw new Error(`Unable to access signer interface of extension`);
  }
}
