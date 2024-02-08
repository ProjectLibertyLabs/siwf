import { derived } from 'svelte/store';
import { AccountMap, AccountsStore, type InjectedAccountWithExtensions } from './AccountsStore';
import { getMsaInfo, type MsaInfo } from '@frequency-control-panel/utils';

export interface MsaInfoWithAccounts extends MsaInfo {
  accounts: AccountMap;
}

export class MsaMap extends Map<string, MsaInfoWithAccounts> {
  constructor() {
    super();
  }
}

export const MsaAccountsStore = derived([AccountsStore], ([$AccountsStore]) =>
  (async () => {
    const accounts: [address: string, account: InjectedAccountWithExtensions][] = [...(await $AccountsStore).entries()];
    const msaInfo = await getMsaInfo(accounts.map(([address]) => address));
    const allMsaInfo = Array.isArray(msaInfo) ? msaInfo : [msaInfo];

    const msaMap = new MsaMap();
    for (const [index, info] of allMsaInfo.entries()) {
      const entry = msaMap.get(info.msaId) ?? { ...info, accounts: new AccountMap() };
      const [address, account] = accounts[index];
      entry.accounts.set(address, account);
      msaMap.set(info.msaId, entry);
    }
    return msaMap;
  })()
);
