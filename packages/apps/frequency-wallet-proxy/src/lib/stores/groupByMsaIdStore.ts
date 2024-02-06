import { derived } from 'svelte/store';
import { CurrentSelectedFilteredMsaAccountsStore } from './CurrentSelectedFilteredMsaAccountsStore';
import type { AccountWithMsaInfo } from '../components';

export const groupByMsaIdStore = derived(
  [CurrentSelectedFilteredMsaAccountsStore],
  ([$CurrentSelectedFilteredMsaAccountsStore]) => {
    return ($CurrentSelectedFilteredMsaAccountsStore || []).reduce(
      (acc: Record<number, AccountWithMsaInfo[]>, account) => {
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
