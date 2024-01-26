import type { ComponentType, SvelteComponent } from 'svelte';
import TalismanIcon from '../icons/TalismanRedIcon.svelte';
import PolkadotIcon from '../icons/Polkadot.svelte';
import SubWallet from '../icons/SubWallet.svelte';
import type { MsaInfo } from '@frequency-control-panel/utils';
import type { InjectedAccount } from '@polkadot/extension-inject/types';

type Logo = {
  component: ComponentType<SvelteComponent>;
  size: string;
};

export interface AccountWithMsaInfo extends InjectedAccount {
  msaInfo: MsaInfo;
}

export enum ExtensionAuthorization {
  None,
  Authorized,
  Rejected,
}

export type Extension = {
  displayName: string;
  injectedName: string;
  downloadUrl: {
    browser?: Record<string, string> | undefined;
    app?: Record<string, string>;
  };
  logo: Logo;
  installed?: boolean;
  authorized: ExtensionAuthorization;
  accounts?: AccountWithMsaInfo[];
};

export const extensionsConfig: Extension[] = [
  {
    displayName: 'Polkadot',
    injectedName: 'polkadot-js',
    downloadUrl: {
      browser: {
        chrome: 'https://chrome.google.com/webstore/detail/talisman-polkadot-and-eth/fijngjgcjhjmmpcmkeiomlglpeiijkld',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
      },
    },
    logo: { component: PolkadotIcon, size: '5em' },
    authorized: ExtensionAuthorization.None,
  },
  {
    displayName: 'Talisman',
    injectedName: 'talisman',
    downloadUrl: {
      browser: {
        chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      },
    },
    logo: { component: TalismanIcon, size: '5em' },
    authorized: ExtensionAuthorization.None,
  },
  {
    displayName: 'SubWallet',
    injectedName: 'subwallet-js',
    downloadUrl: {
      browser: {
        chrome: 'https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
      },
      app: {
        apple: 'https://apps.apple.com/us/app/subwallet-polkadot-wallet/id1633050285',
        android: 'https://play.google.com/store/apps/details?id=app.subwallet.mobile',
      },
    },
    logo: { component: SubWallet, size: '5em' },
    authorized: ExtensionAuthorization.None,
  },
];
