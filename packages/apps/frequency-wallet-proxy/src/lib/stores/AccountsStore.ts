import { derived, readable } from 'svelte/store';
import { type ConnectedExtensionMap, ConnectedExtensionsStore } from '.';

/// Store that maps public key address to the names of wallet extensions that provide it

export class AccountMap extends Map<string, Set<string>> {
  constructor() {
    super();
  }

  public updateAccount(address: string, wallet: string) {
    const set = this.get(address) ?? new Set<string>();
    set.add(wallet);
    this.set(address, set);
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

// export const AccountsStore = derived([ConnectedExtensionsStore], ([$ConnectedExtensionsStore]) =>
//   (async () => {
//     const accountMap: AccountMap = new AccountMap();
//     const extensionMap: ConnectedExtensionMap = await $ConnectedExtensionsStore;
//     for (const extension of [...extensionMap.values()]) {
//       for (const account of extension.accounts) {
//         accountMap.updateAccount(account.address, extension.injectedName);
//       }
//     }

//     return accountMap;
//   })()
// );
