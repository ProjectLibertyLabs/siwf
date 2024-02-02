import { derived } from 'svelte/store';
import type { AccountWithMsaInfo } from '../components';
import { CurrentSelectedFilteredMsaAccountsStore } from './CurrentSelectedFilteredMsaAccountsStore';

export const groupByMsaIdStore = derived(
  [CurrentSelectedFilteredMsaAccountsStore],
  ([$CurrentSelectedFilteredMsaAccountsStore]) => {
    return ($CurrentSelectedFilteredMsaAccountsStore || []).reduce(
      (acc, account) => {
        if (!acc[account.msaInfo.msaId]) {
          acc[account.msaInfo.msaId] = [];
        }

        acc[account.msaInfo.msaId].push(account);
        return acc;
      },
      {} as Record<number, AccountWithMsaInfo[]>
    );
  }
);
