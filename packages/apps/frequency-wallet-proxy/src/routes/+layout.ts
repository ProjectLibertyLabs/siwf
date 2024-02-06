import '../style/app.css';
import type { LayoutLoad } from './$types';
import { extensionsConfig } from '$lib/components';
import {
  CachedExtensionsStore,
  EXTENSION_AUTH_KEY,
  type ExtensionAuthorization,
  ExtensionAuthorizationEnum,
  type ExtensionAuthorizationMap,
} from '$lib/stores';
import { browser } from '$app/environment';
import { delayMs, ExtensionConnector, isExtensionInstalled } from '@frequency-control-panel/utils';
import { APP_NAME } from '$lib/globals';

export const ssr = false;
export const prerender = true;

export const load: LayoutLoad = async () => {
  console.log('In top-level layout load');
  const extensionAuth: ExtensionAuthorizationMap = new Map(
    Array.from(JSON.parse(window.localStorage.getItem(EXTENSION_AUTH_KEY) ?? '[]'))
  );

  for (const { injectedName } of Object.values(extensionsConfig)) {
    let installed = false;
    let ext: ExtensionAuthorization;

    //  Tiny delay here to work around an injection timing bug with the polkadot-js wallet extension.
    //  Without this, we get a false negative for the polkadot-js extension about 10% of the time.
    if (injectedName === 'polkadot-js') {
      await delayMs(50);
    }

    // If extension state  was not previously cached, check if it's installed and add to the cache
    if (!extensionAuth.has(injectedName)) {
      if (browser) {
        installed = isExtensionInstalled(injectedName);
      }

      ext = { injectedName, authorized: ExtensionAuthorizationEnum.None, installed };
    }
    // If extension state was previously cached, update it based on current browser state
    else {
      ext = extensionAuth.get(injectedName)!;
      if (browser) {
        ext.installed = isExtensionInstalled(injectedName);
      }
    }

    if (browser && window.injectedWeb3 && ext.installed && ext.authorized === ExtensionAuthorizationEnum.Authorized) {
      console.log(`Attempting to enable previously connected extension ${injectedName}`);
      const connector = new ExtensionConnector(window.injectedWeb3, APP_NAME);
      try {
        await connector.connect(injectedName);
        ext.authorized = ExtensionAuthorizationEnum.Authorized;
        extensionsConfig[injectedName].connector = connector;
      } catch (e) {
        ext.authorized = ExtensionAuthorizationEnum.Rejected;
        console.error({ msg: `Error enabling extension ${injectedName}`, err: e });
      }
    }

    extensionAuth.set(injectedName, ext);
  }

  // Remove any cached extension not in the config
  for (const name of extensionAuth.keys()) {
    if (!extensionsConfig?.[name]) {
      extensionAuth.delete(name);
    }
  }

  CachedExtensionsStore.set(extensionAuth);
};
