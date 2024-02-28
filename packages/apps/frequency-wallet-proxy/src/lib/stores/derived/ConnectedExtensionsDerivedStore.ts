import type { ConfiguredExtension } from '$lib/components';
import {
  ConnectionError,
  ExtensionConnector,
  ExtensionErrorEnum,
  type InjectedWeb3,
  isExtensionInstalled,
} from '@frequency-control-panel/utils';
import { derived } from 'svelte/store';
import { APP_NAME } from '$lib/globals';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import {
  type CachedExtension,
  type CachedExtensionMap,
  CachedExtensionsStore,
  ExtensionAuthorizationEnum,
} from '../CachedExtensionsStore';
import { extensionsConfig } from '$lib/components';

export let resolveInjectedWeb3: (arg: InjectedWeb3 | undefined) => void;
const awaitWeb3Ready = new Promise<InjectedWeb3 | undefined>((res: (arg: InjectedWeb3 | undefined) => void) => {
  resolveInjectedWeb3 = res;
});

export interface ConnectedExtension extends CachedExtension, ConfiguredExtension {
  connector: ExtensionConnector;
  accounts: InjectedAccount[];
}

export type ConnectedExtensionMap = Record<string, ConnectedExtension>;

async function updateStore(cachedMap: CachedExtensionMap, set: (value: ConnectedExtensionMap) => void) {
  const map: ConnectedExtensionMap = {};
  const injectedWeb3 = await awaitWeb3Ready;
  for (const cached of Object.values(cachedMap)) {
    const orig = { ...cached };
    cached.installed = isExtensionInstalled(cached.injectedName);
    if (injectedWeb3 && cached.installed && cached.authorized === ExtensionAuthorizationEnum.Authorized) {
      const connector = new ExtensionConnector(injectedWeb3, APP_NAME);
      try {
        await connector.connect(cached.injectedName);
        const accounts = await connector.getAccounts();

        const config = extensionsConfig?.[cached.injectedName];
        const connected = {
          ...cached,
          ...config,
          connector,
          accounts,
        };

        map[connected.injectedName] = connected;
        cached.authorized = ExtensionAuthorizationEnum.Authorized;
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
        }
        console.error(err);
      }
    }

    if (orig.authorized !== cached.authorized || orig.installed !== cached.installed) {
      CachedExtensionsStore.updateExtension(cached);
    }
  }
  set(map);
}

export const ConnectedExtensionsDerivedStore = derived(
  [CachedExtensionsStore],
  ([$CachedExtensionsStore], set) => {
    updateStore($CachedExtensionsStore, set);
  },
  {} as ConnectedExtensionMap
);
