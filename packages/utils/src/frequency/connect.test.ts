import { ApiPromise, HttpProvider } from '@polkadot/api';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { getApi } from './connect';

vi.mock('@polkadot/api');

describe('getApi', () => {
  beforeAll(() => {
    vi.mocked(ApiPromise.create).mockResolvedValue({} as ApiPromise);
  });

  it('returns an instance of ApiPromise', async () => {
    const api = await getApi('http://127.0.0.1:9944');
    expect(HttpProvider).toHaveBeenCalledWith('http://127.0.0.1:9944');
    expect(ApiPromise.create).toHaveBeenCalled();
    expect(api).toBeDefined();
  });

  it('reuses the same instance of ApiPromise', async () => {
    const api1 = await getApi();
    const api2 = await getApi();
    expect(api1).toBe(api2);
  });
});
