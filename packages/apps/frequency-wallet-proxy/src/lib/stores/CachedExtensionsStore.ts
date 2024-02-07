import { storable_map } from './storable';
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

export type CachedExtensionMap = Map<string, CachedExtension>;

function createCachedExtensionStore() {
  const { subscribe, set, update } = storable_map<CachedExtensionMap>(
    'ConfiguredExtensions',
    new Map<string, CachedExtension>()
  );

  // Merge with configured extensions
  update((cachedMap) => {
    for (const configuredExt of Object.values(extensionsConfig)) {
      if (!cachedMap.has(configuredExt.injectedName)) {
        cachedMap.set(configuredExt.injectedName, {
          injectedName: configuredExt.injectedName,
          installed: false,
          authorized: ExtensionAuthorizationEnum.None,
        });
      }
    }

    return cachedMap;
  });

  const store = {
    subscribe,
    set,
    update,
    addExtension: (injectedName: string) => {
      update((extensions: CachedExtensionMap) => {
        if (!extensions.has(injectedName)) {
          extensions.set(injectedName, { injectedName, authorized: ExtensionAuthorizationEnum.None, installed: false });
        }

        return extensions;
      });
    },
    updateExtension: (extension: CachedExtension) => {
      update((extensions: CachedExtensionMap) => {
        extensions.set(extension.injectedName, extension);
        return extensions;
      });
    },
  };

  return store;
}

export const CachedExtensionsStore = createCachedExtensionStore();
