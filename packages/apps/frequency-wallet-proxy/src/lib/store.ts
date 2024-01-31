import { writable, derived } from 'svelte/store';
import { extensionsConfig } from './components';
import type { AccountWithMsaInfo, Extension } from './components';
import { writable_storage } from './storable';
import { ExtensionConnector } from '@frequency-control-panel/utils';

export const ExtensionsStore = createExtensionStore();

function createExtensionStore() {
  const { subscribe, set, update } = writable_storage<Extension[]>(
    window.sessionStorage,
    'ExtensionStore',
    extensionsConfig
  );

  // Rebuild injected web3 extensions if read from session storage JSON
  update((extensions) => {
    console.dir({ msg: 'Extensions:', extensions });
    extensions.forEach((extension) => {
      if (extension.connector) {
        extension.connector = new ExtensionConnector(window.injectedWeb3!, 'acme app');
        extension.connector.connect(extension.injectedName);
      }
    });

    return extensions;
  });

  return {
    subscribe,
    set,
    update,
    updateExtension: (extension: Extension) => {
      update((extensions: Extension[]) => {
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

interface SignupStore {
  address: string;
  name: string;
  handle: string;
}

export const SignupStore = writable<SignupStore>({ address: '', name: '', handle: '' } as SignupStore);

export const CurrentSelectedExtensionIdStore = writable_storage<string>(
  window.sessionStorage,
  'CurrentSelectedExtensionId',
  ''
);

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

export const CurrentSelectedAccountWithMsaStore = writable_storage<AccountWithMsaInfo>(
  window.sessionStorage,
  'AccountWithMsaInfo'
);
