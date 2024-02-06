import { writable } from 'svelte/store';
import { extensionsConfig } from '../components';
import type { Extension } from '../components';

function createExtensionStore() {
  const { subscribe, set, update } = writable(extensionsConfig);

  return {
    subscribe,
    set,
    update,
    updateExtension: (extension: Extension) => {
      update((extensions: Record<string, Extension>) => {
        extensions[extension.injectedName] = extension;
        return extensions;
      });
    },
  };
}

export const ExtensionsStore = createExtensionStore();
