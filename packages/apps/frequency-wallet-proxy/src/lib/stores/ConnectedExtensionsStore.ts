import type { ConfiguredExtension } from '$lib/components';
import { ExtensionConnector, type InjectedWeb3 } from '@frequency-control-panel/utils';
import { type CachedExtension, CachedExtensionsStore, ConfiguredExtensionsStore, ExtensionAuthorizationEnum } from '.';
import { derived, writable } from 'svelte/store';
import { APP_NAME } from '$lib/globals';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

export interface ConnectedExtension extends CachedExtension, ConfiguredExtension {
  connector: ExtensionConnector;
  accounts: InjectedAccount[];
}

export const Web3Store = (() => {
  const { set, ...rest } = writable<InjectedWeb3 | undefined>();
  return {
    ...rest,
    set: (value: InjectedWeb3 | undefined) => {
      set(value);
    },
  };
})();

export type ConnectedExtensionMap = Map<string, ConnectedExtension>;

export const ConnectedExtensionsStore = derived(
  [ConfiguredExtensionsStore, CachedExtensionsStore, Web3Store],
  ([$ConfiguredExtensionsStore, $CachedExtensionsStore, $Web3Store]) =>
    (async () => {
      console.debug('Loading connected extensions');
      const map = new Map<string, ConnectedExtension>();
      if (!$Web3Store) {
        return map;
      }
      for (const cached of [...$CachedExtensionsStore.values()]) {
        if (cached.installed && cached.authorized === ExtensionAuthorizationEnum.Authorized) {
          const connector = new ExtensionConnector($Web3Store, APP_NAME);
          try {
            await connector.connect(cached.injectedName);
            const accounts = await connector.getAccounts();

            const config = $ConfiguredExtensionsStore?.[cached.injectedName];
            const connected = {
              ...cached,
              ...config,
              connector,
              accounts,
            };

            map.set(connected.injectedName, connected);
          } catch (err) {
            console.error(err);
          }
        }
      }
      return map;
    })()
);
