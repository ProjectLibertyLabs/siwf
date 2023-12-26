import '@testing-library/jest-dom';
import { expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/svelte';
import SelectWallet from '$components/SelectWallet.svelte';
import { extensionsConfig } from '$lib/extensionsConfig';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

describe.skip('SelectWallet component', () => {
  const originalWindow = global.window;

  beforeAll(() => {
    global.window.injectedWeb3 = {
      talisman: { version: '1.8.3', enable: vi.fn() }
    } as any as InjectedExtension; // Set your desired value here
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  it('renders the wallet buttons with correct text', async () => {
    const { getByText } = render(SelectWallet, {
      props: { extensions: extensionsConfig, endpoint: 'http://localhost:5171' }
    });
    const polkadotWalletButton = screen.getByRole('button', {
      name: /polkadot sign\-in with polkadot wallet/i
    });

    const talismanWalletButton = screen.getByRole('button', {
      name: /talisman sign-in with talisman wallet/i
    });

    expect(polkadotWalletButton).toBeEnabled();
    expect(talismanWalletButton).toBeEnabled();
  });

  it('displays loading indicator while loading', async () => {
    const { getByTestId, container } = render(SelectWallet, {
      props: { extensions: extensionsConfig, endpoint: 'http://localhost:5171' }
    });

    const talismanWalletButton = screen.getByRole('button', {
      name: /talisman sign-in with talisman wallet/i
    });

    await fireEvent.click(talismanWalletButton);

    const loadingIcon = within(talismanWalletButton).getByRole('img', {
      hidden: true
    });

    expect(loadingIcon).toBeInTheDocument();
  });

  it('displays loading indicator download icon', async () => {
    const { getByTestId, container } = render(SelectWallet, {
      props: { extensions: extensionsConfig, endpoint: 'http://localhost:5171' }
    });

    const talismanWalletButton = screen.getByRole('button', {
      name: /talisman sign-in with talisman wallet/i
    });

    await fireEvent.click(talismanWalletButton);

    const downloadIcon = within(talismanWalletButton).getByRole('img', {
      hidden: true
    });

    expect(downloadIcon).toBeInTheDocument();
  });
});
