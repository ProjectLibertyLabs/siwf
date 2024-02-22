import { ApiPromise } from '@polkadot/api';
import { describe, expect, it, vi } from 'vitest';
import { getApi } from './connect';

vi.mock('@polkadot/api', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@polkadot/api')>();
  return {
    ...mod,
    create: vi.fn(() =>
      Promise.resolve({ isReadyOrError: Promise.resolve({} as ApiPromise) } as unknown as ApiPromise)
    ),
  };
});

describe('getApi', () => {
  it('returns an instance of ApiPromise', async () => {
    const createSpy = vi.spyOn(ApiPromise, 'create');
    const api = await getApi('http://127.0.0.1:9944');
    expect(api).toBeDefined();
    // TODO: figure out how to spy on a constructor
    // expect(httpSpy).toHaveBeenCalledWith('http://127.0.0.1:9944');
    expect(createSpy).toHaveBeenCalled();
    expect(api).toBeDefined();
  });

  it('reuses the same instance of ApiPromise', async () => {
    const api1 = await getApi();
    const api2 = await getApi();
    expect(api1).toBe(api2);
  });
});
