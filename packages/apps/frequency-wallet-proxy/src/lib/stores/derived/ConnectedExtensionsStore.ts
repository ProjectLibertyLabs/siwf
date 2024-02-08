import type { ConfiguredExtension } from '$lib/components';
import {
  ConnectionError,
  ExtensionConnector,
  ExtensionErrorEnum,
  type InjectedWeb3,
} from '@frequency-control-panel/utils';
import { derived } from 'svelte/store';
import { APP_NAME } from '$lib/globals';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import { type CachedExtension, CachedExtensionsStore, ExtensionAuthorizationEnum } from '../CachedExtensionsStore';
import { ConfiguredExtensionsStore } from '../ConfiguredExtensionsStore';

export let resolveInjectedWeb3: (arg: InjectedWeb3) => void;
const awaitWeb3Ready = new Promise<InjectedWeb3>((res: (arg: InjectedWeb3) => void) => {
  resolveInjectedWeb3 = res;
});

export interface ConnectedExtension extends CachedExtension, ConfiguredExtension {
  connector: ExtensionConnector;
  accounts: InjectedAccount[];
}

export type ConnectedExtensionMap = Map<string, ConnectedExtension>;

export const ConnectedExtensionsStore = derived(
  [ConfiguredExtensionsStore, CachedExtensionsStore],
  ([$ConfiguredExtensionsStore, $CachedExtensionsStore]) =>
    (async () => {
      const map = new Map<string, ConnectedExtension>();
      const injectedWeb3 = await awaitWeb3Ready;
      for (const cached of [...$CachedExtensionsStore.values()]) {
        if (cached.installed && cached.authorized === ExtensionAuthorizationEnum.Authorized) {
          const connector = new ExtensionConnector(injectedWeb3, APP_NAME);
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
            if (err instanceof ConnectionError) {
              switch (err.reason) {
                case ExtensionErrorEnum.UNKNOWN:
                case ExtensionErrorEnum.PENDING_AUTH:
                  cached.authorized = ExtensionAuthorizationEnum.None;
                  break;

                case ExtensionErrorEnum.NO_ACCOUNTS_AUTHORIZED:
                case ExtensionErrorEnum.UNAUTHORIZED:
                  cached.authorized = ExtensionAuthorizationEnum.Rejected;
                  break;

                case ExtensionErrorEnum.NO_EXTENSION:
                  cached.installed = false;
                  break;
              }

              CachedExtensionsStore.updateExtension(cached);
            }
            console.error(err);
          }
        }
      }
      console.log('Connected store size ', map.size);
      return map;
    })()
);
