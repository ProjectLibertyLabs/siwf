import type { ConfiguredExtension } from '$lib/components';
import { ExtensionConnector, type InjectedWeb3 } from '@frequency-control-panel/utils';
import { type CachedExtension, CachedExtensionsStore, ConfiguredExtensionsStore, ExtensionAuthorizationEnum } from '.';
import { derived, writable } from 'svelte/store';
import { APP_NAME } from '$lib/globals';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

export interface ConnectedExtension extends CachedExtension, ConfiguredExtension {
  connector: ExtensionConnector;
  accounts: InjectedAccount[];
}

export const Web3Store = (() => {
  const { set, ...rest } = writable<InjectedWeb3 | undefined>();
  return {
    ...rest,
    set: (value: InjectedWeb3 | undefined) => {
      set(value);
    },
  };
})();

export type ConnectedExtensionMap = Map<string, ConnectedExtension>;

export const ConnectedExtensionsStore = derived(
  [ConfiguredExtensionsStore, CachedExtensionsStore, Web3Store],
  ([$ConfiguredExtensionsStore, $CachedExtensionsStore, $Web3Store]) =>
    (async () => {
      console.debug('Loading connected extensions');
      const map = new Map<string, ConnectedExtension>();
      if (!$Web3Store) {
        return map;
      }
      for (const cached of [...$CachedExtensionsStore.values()]) {
        if (cached.installed && cached.authorized === ExtensionAuthorizationEnum.Authorized) {
          const connector = new ExtensionConnector($Web3Store, APP_NAME);
          try {
            await connector.connect(cached.injectedName);
            const accounts = await connector.getAccounts();

            const config = $ConfiguredExtensionsStore?.[cached.injectedName];
            const connected = {
              ...cached,
              ...config,
              connector,
              accounts,
            };

            map.set(connected.injectedName, connected);
          } catch (err) {
            console.error(err);
          }
        }
      }
      return map;
    })()
);

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

// export const AccountsStore = readable(new AccountMap(), (set) => {
//   const unsub = ConnectedExtensionsStore.subscribe(async (ConnectedExtensionPromise) => {
//     const accountMap: AccountMap = new AccountMap();
//     const extensionMap: ConnectedExtensionMap = await ConnectedExtensionPromise;
//     for (const extension of [...extensionMap.values()]) {
//       for (const account of extension.accounts) {
//         accountMap.updateAccount(account.address, extension.injectedName);
//       }
//     }

//     set(accountMap);
//   });
//   return () => unsub();
// });

export const AccountsStore = derived([ConnectedExtensionsStore], ([$ConnectedExtensionsStore]) =>
  (async () => {
    const accountMap: AccountMap = new AccountMap();
    const extensionMap: ConnectedExtensionMap = await $ConnectedExtensionsStore;
    for (const extension of [...extensionMap.values()]) {
      for (const account of extension.accounts) {
        accountMap.updateAccount(account, extension.injectedName);
      }
    }

    return accountMap;
  })()
);
