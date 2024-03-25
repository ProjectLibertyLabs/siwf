import { derived } from 'svelte/store';
import { type AccountMap, AllAccountsDerivedStore } from './AllAccountsDerivedStore';
import { CurrentSelectedExtensionIdStore } from '../CurrentSelectedExtensionIdStore';

export const FilteredAccountsDerivedStore = derived(
  [AllAccountsDerivedStore, CurrentSelectedExtensionIdStore],
  ([$AllAccountsDerivedStore, $CurrentSelectedExtensionIdStore]) => {
    const accounts = Object.entries($AllAccountsDerivedStore).filter(([_, account]) =>
      account.wallets.has($CurrentSelectedExtensionIdStore)
    );

    accounts.forEach(([_, account]) => {
      account.wallets = new Set([$CurrentSelectedExtensionIdStore]);
    });

    const map = accounts.reduce((map, [address, account]) => {
      map[address] = account;
      return map;
    }, {} as AccountMap);

    return map;
  }
);
