import { derived } from 'svelte/store';
import { type ConnectedExtensionMap, ConnectedExtensionsStore } from './ConnectedExtensionsStore';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

/// Store that maps public key address to the names of wallet extensions that provide it

export interface InjectedAccountWithExtensions extends InjectedAccount {
  wallets: Set<string>;
}

export type AccountMap = Map<string, InjectedAccountWithExtensions>;

export function createAccountMap() {
  return new Map<string, InjectedAccountWithExtensions>();
}

function updateAccount(map: AccountMap, account: InjectedAccount, wallet: string) {
  const value = map.get(account.address) ?? { ...account, wallets: new Set<string>() };
  value.wallets.add(wallet);
  map.set(account.address, value);
}
export const AccountsStore = derived([ConnectedExtensionsStore], ([$ConnectedExtensionsStore]) =>
  (async () => {
    const accountMap: AccountMap = createAccountMap();
    if (!!$ConnectedExtensionsStore) {
      const extensionMap: ConnectedExtensionMap = await $ConnectedExtensionsStore;
      for (const extension of [...extensionMap.values()]) {
        for (const account of extension.accounts) {
          updateAccount(accountMap, account, extension.injectedName);
        }
      }
    }
    return accountMap;
  })()
);
