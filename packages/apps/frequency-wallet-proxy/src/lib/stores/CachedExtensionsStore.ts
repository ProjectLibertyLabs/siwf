import { storable } from './storable';
import { extensionsConfig } from '$lib/components';

const EXTENSION_AUTH_KEY = 'ConfiguredExtensions';

export enum ExtensionAuthorizationEnum {
  None,
  Authorized,
  Rejected,
}

export type CachedExtension = {
  injectedName: string;
  installed: boolean;
  authorized: ExtensionAuthorizationEnum;
};

export type CachedExtensionMap = Record<string, CachedExtension>;

function createCachedExtensionStore() {
  const { subscribe, update } = storable<CachedExtensionMap>(EXTENSION_AUTH_KEY, {});

  // Merge data read from local storage with current extension metadata
  update((cachedMap) => {
    for (const configuredExt of Object.values(extensionsConfig)) {
      if (!cachedMap?.[configuredExt.injectedName]) {
        cachedMap[configuredExt.injectedName] = {
          injectedName: configuredExt.injectedName,
          installed: false,
          authorized: ExtensionAuthorizationEnum.None,
        };
      }
    }

    return cachedMap;
  });

  const store = {
    subscribe,
    updateExtension: (extension: CachedExtension) => {
      update((extensionMap: CachedExtensionMap) => {
        extensionMap[extension.injectedName] = extension;
        return extensionMap;
      });
    },
  };

  return store;
}

export const CachedExtensionsStore = createCachedExtensionStore();
