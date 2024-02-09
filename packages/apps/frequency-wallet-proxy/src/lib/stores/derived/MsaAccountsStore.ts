import { derived } from 'svelte/store';
import { type AccountMap, AccountsStore, type InjectedAccountWithExtensions } from './AccountsStore';
import { getMsaInfo, type MsaInfo } from '@frequency-control-panel/utils';

export interface MsaInfoWithAccounts extends MsaInfo {
  accounts: AccountMap;
}

export type MsaMap = Record<string, MsaInfoWithAccounts>;

export const MsaAccountsStore = derived([AccountsStore], ([$AccountsStore]) =>
  (async () => {
    const accounts: [address: string, account: InjectedAccountWithExtensions][] = Object.entries(await $AccountsStore);
    const msaInfo = await getMsaInfo(accounts.map(([address]) => address));
    const allMsaInfo = Array.isArray(msaInfo) ? msaInfo : [msaInfo];

    const msaMap: MsaMap = {};
    for (const [index, info] of allMsaInfo.entries()) {
      const entry = msaMap?.[info.msaId] ?? { ...info, accounts: {} };
      const [address, account] = accounts[index];
      entry.accounts[address] = account;
      msaMap[info.msaId] = entry;
    }
    return msaMap;
  })()
);
