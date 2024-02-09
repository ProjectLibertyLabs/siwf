import type { ComponentType, SvelteComponent } from 'svelte';
import type { MsaInfo } from '@frequency-control-panel/utils';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import TalismanIcon from '../icons/TalismanRedIcon.svelte';
import PolkadotIcon from '../icons/Polkadot.svelte';
import SubWallet from '../icons/SubWallet.svelte';

type Logo = {
  component: ComponentType<SvelteComponent>;
  size: string;
};

export interface ConfiguredExtension {
  injectedName: string;
  displayName: string;
  downloadUrl: {
    browser?: Record<string, string>;
    app?: Record<string, string>;
  };
  logo: Logo;
}

export interface AccountWithWallet {
  address: string;
  wallets: Set<string>;
}

export interface AccountWithMsaInfo extends InjectedAccount {
  walletNames: Set<string>;
  msaInfo: MsaInfo;
}

export type ExtensionsConfig = Record<string, ConfiguredExtension>;

export const extensionsConfig: ExtensionsConfig = {
  'polkadot-js': {
    displayName: 'Polkadot',
    injectedName: 'polkadot-js',
    downloadUrl: {
      browser: {
        chrome: 'https://chrome.google.com/webstore/detail/talisman-polkadot-and-eth/fijngjgcjhjmmpcmkeiomlglpeiijkld',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
      },
    },
    logo: { component: PolkadotIcon, size: '5em' },
  },

  talisman: {
    displayName: 'Talisman',
    injectedName: 'talisman',
    downloadUrl: {
      browser: {
        chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      },
    },
    logo: { component: TalismanIcon, size: '5em' },
  },

  'subwallet-js': {
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
  },
};
