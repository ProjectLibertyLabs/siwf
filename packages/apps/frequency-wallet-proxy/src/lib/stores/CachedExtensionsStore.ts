import { storable } from './storable';

export const EXTENSION_AUTH_KEY = 'ConfiguredExtensions';

export enum ExtensionAuthorizationEnum {
  None,
  Authorized,
  Rejected,
}

export type ExtensionAuthorization = {
  injectedName: string;
  installed: boolean;
  authorized: ExtensionAuthorizationEnum;
};

export type ExtensionAuthorizationMap = Map<string, ExtensionAuthorization>;

function createConfiguredExtensionStore() {
  const { subscribe, set, update } = storable<ExtensionAuthorizationMap>(
    'ConfiguredExtensions',
    new Map<string, ExtensionAuthorization>()
  );

  const store = {
    subscribe,
    set,
    update,
    addExtension: (injectedName: string) => {
      update((extensions: ExtensionAuthorizationMap) => {
        if (!extensions.has(injectedName)) {
          extensions.set(injectedName, { injectedName, authorized: ExtensionAuthorizationEnum.None, installed: false });
        }

        return extensions;
      });
    },
    updateExtension: (extension: ExtensionAuthorization) => {
      update((extensions: ExtensionAuthorizationMap) => {
        extensions.set(extension.injectedName, extension);
        return extensions;
      });
    },
  };

  return store;
}

export const CachedExtensionsStore = createConfiguredExtensionStore();
