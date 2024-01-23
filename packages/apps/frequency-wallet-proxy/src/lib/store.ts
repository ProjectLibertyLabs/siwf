import { writable, derived } from 'svelte/store';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import type { MsaInfo } from '@frequency-control-panel/utils';

export interface AccountWithMsaInfo extends InjectedAccount {
  msaInfo: MsaInfo;
}

const SelectedExtensionAccounts: AccountWithMsaInfo[] = [];

export const SelectedExtensionAccountsStore = writable(SelectedExtensionAccounts);

export const filteredMsaAccountsStore = derived([SelectedExtensionAccountsStore], ([$SelectedExtensionAccountsStore]) => {
  return $SelectedExtensionAccountsStore.filter((account) => account.msaInfo.msaId !== 0);
});

export const groupByMsaIdStore = derived([filteredMsaAccountsStore], ([$filteredMsaAccountsStore]) => {
  return $filteredMsaAccountsStore.reduce(
    (acc, account) => {
      if (!acc[account.msaInfo.msaId]) {
        acc[account.msaInfo.msaId] = [];
      }

      acc[account.msaInfo.msaId].push(account);
      return acc;
    },
    {} as Record<number, AccountWithMsaInfo[]>
  );
});
