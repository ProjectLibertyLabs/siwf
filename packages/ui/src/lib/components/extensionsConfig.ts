import type { ComponentType, SvelteComponent } from 'svelte';
import type { MsaInfo } from '@amplica-labs/siwf-utils';
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
    browser?: URL;
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
      browser: new URL('https://polkadot.js.org/extension/'),
    },
    logo: { component: PolkadotIcon, size: '5em' },
  },

  talisman: {
    displayName: 'Talisman',
    injectedName: 'talisman',
    downloadUrl: {
      browser: new URL('https://www.talisman.xyz/download'),
    },
    logo: { component: TalismanIcon, size: '5em' },
  },

  'subwallet-js': {
    displayName: 'SubWallet',
    injectedName: 'subwallet-js',
    downloadUrl: {
      browser: new URL('https://www.subwallet.app/download.html'),
      app: {
        apple: 'https:/apple.com/us/app/subwallet-polkadot-wallet/id1633050285',
        android: 'https://play.google.com/store/details?id=app.subwallet.mobile',
      },
    },
    logo: { component: SubWallet, size: '5em' },
  },
};
