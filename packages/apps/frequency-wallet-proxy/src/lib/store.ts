import { writable, derived } from 'svelte/store';
import { extensionsConfig } from './components';
import type { AccountWithMsaInfo, Extension } from './components';

export const ExtensionsStore = createExtensionStore();

function createExtensionStore() {
  const { subscribe, set, update } = writable<Extension[]>(extensionsConfig);

  return {
    subscribe,
    set,
    update,
    updateExtension: (extension: Extension) => {
      update((extensions) => {
        return extensions.map((e) => {
          if (e.injectedName === extension.injectedName) {
            return extension;
          }
          return e;
        });
      });
    },
  };
}

export const CurrentSelectedExtensionIdStore = writable<string>('');

export const CurrentSelectedExtensionStore = derived(
  [CurrentSelectedExtensionIdStore, ExtensionsStore],
  ([$CurrentSelectedExtensionStore, $ExtensionsStore]) => {
    return $ExtensionsStore.find((extension) => extension.injectedName === $CurrentSelectedExtensionStore);
  }
);

export const CurrentSelectedFilteredMsaAccountsStore = derived(
  [CurrentSelectedExtensionStore],
  ([$CurrentSelectedExtensionStore]) => {
    if ($CurrentSelectedExtensionStore === undefined) return;
    return ($CurrentSelectedExtensionStore?.accounts || []).filter((account) => !!account.msaInfo.msaId);
  }
);

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

export const CurrentSelectedAccountWithMsaStore = writable<AccountWithMsaInfo>();
