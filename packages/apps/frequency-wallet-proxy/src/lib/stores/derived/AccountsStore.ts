import { derived } from 'svelte/store';
import { type ConnectedExtensionMap, ConnectedExtensionsStore } from './ConnectedExtensionsStore';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

/// Store that maps public key address to the names of wallet extensions that provide it

export interface InjectedAccountWithExtensions extends InjectedAccount {
  wallets: Set<string>;
}

export class AccountMap extends Map<string, InjectedAccountWithExtensions> {
  constructor() {
    super();
  }

  public updateAccount(account: InjectedAccount, wallet: string) {
    const value = this.get(account.address) ?? { ...account, wallets: new Set<string>() };
    value.wallets.add(wallet);
    this.set(account.address, value);
  }
}

export const AccountsStore = derived([ConnectedExtensionsStore], ([$ConnectedExtensionsStore]) =>
  (async () => {
    const accountMap: AccountMap = new AccountMap();
    if (!!$ConnectedExtensionsStore) {
      const extensionMap: ConnectedExtensionMap = await $ConnectedExtensionsStore;
      for (const extension of [...extensionMap.values()]) {
        for (const account of extension.accounts) {
          accountMap.updateAccount(account, extension.injectedName);
        }
      }
    }
    return accountMap;
  })()
);
