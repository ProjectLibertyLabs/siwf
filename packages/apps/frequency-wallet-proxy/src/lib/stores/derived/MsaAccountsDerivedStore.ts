import { derived, type Readable } from 'svelte/store';
import {
  type AccountMap,
  AllAccountsDerivedStore,
  type InjectedAccountWithExtensions,
} from './AllAccountsDerivedStore';
import { getMsaInfo, type MsaInfo } from '@frequency-control-panel/utils';
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
      const allMsaInfo = Array.isArray(msaInfo) ? msaInfo : [msaInfo];
      const filteredMsaInfo = allMsaInfo.filter((msaInfo) => msaInfo.msaId !== '0');

      const msaMap: MsaMap = {};
      for (const [index, info] of filteredMsaInfo.entries()) {
        const entry = msaMap?.[info.msaId] || { ...info, accounts: {} };
        const [address, account] = accounts[index];
        entry.accounts[address] = account;
        msaMap[info.msaId] = entry;
      }
      return msaMap;
    })()
  );
}

export const MsaAccountsDerivedStore = createMsaStore(AllAccountsDerivedStore);
export const FilteredMsaAccountsDerivedStore = createMsaStore(FilteredAccountsDerivedStore);
