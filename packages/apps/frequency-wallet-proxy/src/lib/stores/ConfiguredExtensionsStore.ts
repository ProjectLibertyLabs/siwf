import { type ExtensionAuthorization, extensionsConfig, ExtensionAuthorizationEnum } from '$lib/components';
import { storable } from './storable';
import { browser } from '$app/environment';

const STORAGE_KEY = 'ConfiguredExtensions';

function createConfiguredExtensionStore() {
  const cached = JSON.parse(
    browser ? window.localStorage.getItem(STORAGE_KEY) ?? '[]' : '[]'
  ) as ExtensionAuthorization[];
  extensionsConfig.forEach((config) => {
    if (!cached.some((item) => item.injectedName === config.injectedName)) {
      cached.push({ injectedName: config.injectedName, authorized: ExtensionAuthorizationEnum.None });
    }
  });

  const { subscribe, set, update } = storable<ExtensionAuthorization[]>(
    'ConfiguredExtensions',
    extensionsConfig.map((e) => ({ injectedName: e.injectedName, authorized: e.authorized }))
  );

  const store = {
    subscribe,
    set,
    update,
    addExtension: (extension: ExtensionAuthorization) => {
      update((extensions: ExtensionAuthorization[]) => {
        if (!extensions.some((e) => e.injectedName === extension.injectedName)) {
          const { injectedName, authorized } = extension;
          extensions.push({ injectedName, authorized });
        }

        return extensions;
      });
    },
    updateExtension: (extension: ExtensionAuthorization) => {
      update((extensions: ExtensionAuthorization[]) => {
        return extensions.map((e) => {
          const { injectedName, authorized } = extension;
          if (e.injectedName === extension.injectedName) {
            return { injectedName, authorized };
          }
          return e;
        });
      });
    },
  };

  extensionsConfig.forEach((e) => store.addExtension(e));

  return store;
}
