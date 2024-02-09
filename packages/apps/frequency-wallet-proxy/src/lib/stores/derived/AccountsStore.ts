import { derived } from 'svelte/store';
import { type ConnectedExtensionMap, ConnectedExtensionsDerivedStore } from './ConnectedExtensionsStore';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

/// Store that maps public key address to the names of wallet extensions that provide it

export interface InjectedAccountWithExtensions extends InjectedAccount {
  wallets: Set<string>;
}

export type AccountMap = Record<string, InjectedAccountWithExtensions>;

function updateAccount(map: AccountMap, account: InjectedAccount, wallet: string) {
  const value = map?.[account.address] ?? { ...account, wallets: new Set<string>() };
  value.wallets.add(wallet);
  map[account.address] = value;
}

export const AccountsDerivedStore = derived([ConnectedExtensionsDerivedStore], ([$ConnectedExtensionsStore]) =>
  (async () => {
    const accountMap: AccountMap = {};
    if (!!$ConnectedExtensionsStore) {
      const extensionMap: ConnectedExtensionMap = await $ConnectedExtensionsStore;
      for (const extension of Object.values(extensionMap)) {
        for (const account of extension.accounts) {
          updateAccount(accountMap, account, extension.injectedName);
        }
      }
    }
    return accountMap;
  })()
);
