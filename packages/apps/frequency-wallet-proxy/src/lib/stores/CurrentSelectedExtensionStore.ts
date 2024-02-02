import { derived } from 'svelte/store';
import { ExtensionsStore } from './ExtensionsStore';
import { CurrentSelectedExtensionIdStore } from './CurrentSelectedExtensionIdStore';

export const CurrentSelectedExtensionStore = derived(
  [CurrentSelectedExtensionIdStore, ExtensionsStore],
  ([$CurrentSelectedExtensionStore, $ExtensionsStore]) => {
    return $ExtensionsStore.find((extension) => extension.injectedName === $CurrentSelectedExtensionStore);
  }
);
