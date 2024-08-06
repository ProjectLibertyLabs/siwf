import { derived, type Readable } from 'svelte/store';
import {
  type AccountMap,
  AllAccountsDerivedStore,
  type InjectedAccountWithExtensions,
} from './AllAccountsDerivedStore';
import { getMsaIds, getMsaInfo, type MsaInfo } from '@projectlibertylabs/siwf-utils';
import { FilteredAccountsDerivedStore } from './FilteredAccountsDerivedStore';

export interface MsaInfoWithAccounts extends MsaInfo {
  accounts: AccountMap;
}

export type MsaMap = Record<string, MsaInfoWithAccounts>;

function createMsaStore(source: Readable<AccountMap>) {
  return derived(
    [source],
    ([$source], set) => {
      const accounts: [address: string, account: InjectedAccountWithExtensions][] = Object.entries($source);
      getMsaInfo(accounts.map(([address]) => address)).then((msaInfo) => {
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
        set(msaMap);
      });
    },
    {} as MsaMap
  );
}

function createNonMsaStore(source: Readable<AccountMap>) {
  return derived(
    [source],
    ([$source], set) => {
      const accounts: [address: string, account: InjectedAccountWithExtensions][] = Object.entries($source);
      getMsaIds(accounts.map(([address]) => address)).then((msaIds) => {
        const accountMap: AccountMap = {};
        for (const [index, msaId] of msaIds.entries()) {
          if (msaId !== '0') {
            continue;
          }
          accountMap[accounts[index][0]] = accounts[index][1];
        }

        set(accountMap);
      });
    },
    {} as AccountMap
  );
}

export const MsaAccountsDerivedStore = createMsaStore(AllAccountsDerivedStore);
export const FilteredMsaAccountsDerivedStore = createMsaStore(FilteredAccountsDerivedStore);
export const NonMsaAccountsDerivedStore = createNonMsaStore(AllAccountsDerivedStore);
export const FilteredNonMsaAccountsDerivedStore = createNonMsaStore(FilteredAccountsDerivedStore);
