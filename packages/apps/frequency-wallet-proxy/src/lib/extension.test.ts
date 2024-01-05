import { expect, describe, it, vi, beforeEach } from 'vitest';
import type { InjectedWindowProvider, Injected } from '@polkadot/extension-inject/types';
import { WalletConnector } from './extension';

describe('WalletConnector', () => {
  beforeEach(() => {
    window.injectedWeb3 = {} as Record<string, InjectedWindowProvider>;
  });

  describe('connectExtension', () => {
    it('returns extension when wallet extension found and enable function exists', async () => {
      window.injectedWeb3 = {
        injectedName: {
          enable: async (): Promise<Injected> => {
            return {
              accounts: {
                get: vi.fn().mockResolvedValue([]),
                subscribe: vi.fn(),
              },
              metadata: {
                get: vi.fn().mockResolvedValue([]),
                provide: vi.fn().mockResolvedValue(true),
              },
              signer: {},
            };
          },
          version: '1.0.0',
        },
      };

      const walletConnector = new WalletConnector(window.injectedWeb3);

      const result = await walletConnector.connectExtension('injectedName', 'originName');
      ['name', 'version', 'accounts', 'metadata', 'signer'].forEach((value) => {
        expect(result).toHaveProperty(value);
      });
    });

    it('throws error when wallet extension not found', async () => {
      window.injectedWeb3 = {} as Record<string, InjectedWindowProvider>;
      const walletConnector = new WalletConnector(window.injectedWeb3);
      await expect(walletConnector.connectExtension('injectedName', 'originName')).rejects.toThrowError(
        'Wallet extension injectedName not found'
      );
    });

    it('throws error when no connect or enable function found', async () => {
      window.injectedWeb3 = {
        injectedName: {},
      };

      const walletConnector = new WalletConnector(window.injectedWeb3);

      await expect(walletConnector.connectExtension('injectedName', 'originName')).rejects.toThrowError(
        'No connect(..) or enable(...) hook found'
      );
    });
  });

  describe('requestAccountsFor', () => {
    beforeEach(() => {
      window.injectedWeb3 = {} as Record<string, InjectedWindowProvider>;
    });

    it('returns accounts when wallet extension found and accounts.get function exists', async () => {
      window.injectedWeb3 = {
        injectedName: {
          enable: async (): Promise<Injected> => {
            return {
              accounts: {
                get: vi.fn().mockResolvedValue([
                  { address: '0x123', balance: '100' },
                  { address: '0x456', balance: '200' },
                ]),
                subscribe: vi.fn(),
              },
              signer: {},
            };
          },
        },
      };

      const walletConnector = new WalletConnector(window.injectedWeb3);
      const result = await walletConnector.requestAccountsFor('injectedName', 'requesterName');
      expect(result).toEqual([
        { address: '0x123', balance: '100' },
        { address: '0x456', balance: '200' },
      ]);
    });

    it('returns empty array when wallet extension not found', async () => {
      window.injectedWeb3 = {} as Record<string, InjectedWindowProvider>;
      const walletConnector = new WalletConnector(window.injectedWeb3);
      const result = await walletConnector.requestAccountsFor('injectedName', 'requesterName');
      expect(result).toEqual([]);
    });

    it('returns empty array when accounts.get function not found', async () => {
      window.injectedWeb3 = {
        injectedName: {},
      };
      const walletConnector = new WalletConnector(window.injectedWeb3);
      const result = await walletConnector.requestAccountsFor('injectedName', 'requesterName');
      expect(result).toEqual([]);
    });

    it('returns empty array and logs the error when an error occurs', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation((e) => {
        console.log('hello', e);
      });
      window.injectedWeb3 = {
        injectedName: {
          enable: async (): Promise<Injected> => {
            return {
              accounts: {
                get: async () => {
                  throw new Error('Failed to get accounts');
                },
                subscribe: vi.fn(),
              },
              signer: {},
            };
          },
        },
      };

      const walletConnector = new WalletConnector(window.injectedWeb3);
      const result = await walletConnector.requestAccountsFor('injectedName', 'requesterName');
      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith(new Error('Failed to get accounts'));
    });
  });
});
