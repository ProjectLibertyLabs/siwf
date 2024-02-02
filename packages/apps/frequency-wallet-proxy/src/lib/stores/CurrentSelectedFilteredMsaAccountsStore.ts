import { derived } from 'svelte/store';
import { CurrentSelectedExtensionStore } from './CurrentSelectedExtensionStore';

export const CurrentSelectedFilteredMsaAccountsStore = derived(
  [CurrentSelectedExtensionStore],
  ([$CurrentSelectedExtensionStore]) => {
    if ($CurrentSelectedExtensionStore === undefined) return;
    return ($CurrentSelectedExtensionStore?.accounts || []).filter((account) => !!account.msaInfo.msaId);
  }
);
