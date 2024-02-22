import { derived, type Readable } from 'svelte/store';
import {
  type AccountMap,
  AllAccountsDerivedStore,
  type InjectedAccountWithExtensions,
} from './AllAccountsDerivedStore';
import { getMsaIds, getMsaInfo, type MsaInfo } from '@frequency-control-panel/utils';
import { FilteredAccountsDerivedStore } from './FilteredAccountsDerivedStore';

export interface MsaInfoWithAccounts extends MsaInfo {
  accounts: AccountMap;
}

export type MsaMap = Record<string, MsaInfoWithAccounts>;

function createMsaStore(source: Readable<Promise<AccountMap>>) {
  return derived([source], ([$source]) =>
    (async () => {
      const accounts: [address: string, account: InjectedAccountWithExtensions][] = Object.entries(await $source);
      const msaInfo = await getMsaInfo(accounts.map(([address]) => address));

      const msaMap: MsaMap = {};
      for (const [index, info] of msaInfo.entries()) {
        if (info.msaId === '0') {
          continue;
        }
        const entry = msaMap?.[info.msaId] || { ...info, accounts: {} };
        const [address, account] = accounts[index];
        entry.accounts[address] = account;
        msaMap[info.msaId] = entry;
      }
      return msaMap;
    })()
  );
}

function createNonMsaStore(source: Readable<Promise<AccountMap>>) {
  return derived([source], ([$source]) =>
    (async () => {
      const accounts: [address: string, account: InjectedAccountWithExtensions][] = Object.entries(await $source);
      const msaIds = await getMsaIds(accounts.map(([address]) => address));

      const accountMap: AccountMap = {};
      for (const [index, msaId] of msaIds.entries()) {
        if (msaId !== '0') {
          continue;
        }
        accountMap[accounts[index][0]] = accounts[index][1];
      }

      return accountMap;
    })()
  );
}

export const MsaAccountsDerivedStore = createMsaStore(AllAccountsDerivedStore);
export const FilteredMsaAccountsDerivedStore = createMsaStore(FilteredAccountsDerivedStore);
export const NonMsaAccountsDerivedStore = createNonMsaStore(AllAccountsDerivedStore);
export const FilteredNonMsaAccountsDerivedStore = createNonMsaStore(FilteredAccountsDerivedStore);
