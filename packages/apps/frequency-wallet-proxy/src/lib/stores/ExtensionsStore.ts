import { ExtensionAuthorization, extensionsConfig } from '../components';
import type { Extension } from '../components';
import { storable } from './storable';
import { ExtensionConnector } from '@frequency-control-panel/utils';

export const ExtensionsStore = createExtensionStore();
function createExtensionStore() {
  const { subscribe, set, update } = storable<Extension[]>('ExtensionStore', extensionsConfig);

  // Rebuild injected web3 extensions if read from session storage JSON
  update((extensions) => {
    extensions.forEach((extension) => {
      const originalExtension = extensionsConfig.find((e) => e.injectedName === extension.injectedName);
      if (originalExtension) {
        extension.logo = originalExtension.logo;
      }
      if (extension.authorized === ExtensionAuthorization.Authorized) {
        console.log(`Reconnecting authorized extension ${extension.injectedName}`);
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
