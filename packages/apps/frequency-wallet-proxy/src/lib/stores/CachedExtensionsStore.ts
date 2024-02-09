import { storable } from './storable';
import { extensionsConfig } from '$lib/components';

export const EXTENSION_AUTH_KEY = 'ConfiguredExtensions';

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
  const { subscribe, update } = storable<CachedExtensionMap>('ConfiguredExtensions', {});

  // Merge with configured extensions
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
      update((extensions: CachedExtensionMap) => {
        extensions[extension.injectedName] = extension;
        return extensions;
      });
    },
  };

  return store;
}

export const CachedExtensionsStore = createCachedExtensionStore();
