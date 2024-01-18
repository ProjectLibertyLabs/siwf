import { expect, describe, it, vi } from 'vitest';
import type { InjectedWindowProvider, Injected } from '@polkadot/extension-inject/types';
import type { InjectedWeb3 } from './extension';
import { ExtensionConnector } from './extension';

describe('WalletConnector', () => {
  const window: Record<string, InjectedWeb3> = {};

  describe('connect', () => {
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

      const walletConnector = new ExtensionConnector(window.injectedWeb3);

      const result = await walletConnector.connect('injectedName');
      ['name', 'version', 'accounts', 'metadata', 'signer'].forEach((value) => {
        expect(result).toHaveProperty(value);
      });
    });

    it('throws error when wallet extension not found', async () => {
      window.injectedWeb3 = {} as Record<string, InjectedWindowProvider>;
      const walletConnector = new ExtensionConnector(window.injectedWeb3);
      await expect(walletConnector.connect('injectedName')).rejects.toThrowError(
        'Wallet extension injectedName not found'
      );
    });

    it('throws error when no connect or enable function found', async () => {
      window.injectedWeb3 = {
        injectedName: {},
      };

      const walletConnector = new ExtensionConnector(window.injectedWeb3);

      await expect(walletConnector.connect('injectedName')).rejects.toThrowError(
        'No connect(..) or enable(...) hook found'
      );
    });
  });

  describe('getAccounts', () => {
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

      const walletConnector = new ExtensionConnector(window.injectedWeb3);
      await walletConnector.connect('injectedName');
      const result = await walletConnector.getAccounts();
      expect(result).toEqual([
        { address: '0x123', balance: '100' },
        { address: '0x456', balance: '200' },
      ]);
    });

    it('throws an error when wallet extension not found', async () => {
      window.injectedWeb3 = {} as InjectedWeb3;

      const walletConnector = new ExtensionConnector(window.injectedWeb3);
      await expect(() => walletConnector.getAccounts()).rejects.toThrowError('Wallet extension connection not found');
    });

    it('throws empty array when faiing to get accounts', async () => {
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

      const walletConnector = new ExtensionConnector(window.injectedWeb3);
      await walletConnector.connect('injectedName');

      await expect(() => walletConnector.getAccounts()).rejects.toThrowError('Failed to request accounts');
    });

    it('throws an error and logs the error when an error occurs', async () => {
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

      const walletConnector = new ExtensionConnector(window.injectedWeb3);

      await walletConnector.connect('injectedName');

      await expect(() => walletConnector.getAccounts()).rejects.toThrowError('Failed to request accounts');
      expect(spy).toHaveBeenCalledWith(new Error('Failed to get accounts'));
    });
  });
});
