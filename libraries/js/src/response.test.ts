import { describe, it, vi, expect, beforeAll } from 'vitest';
import { ExampleLogin, ExampleNewProvider, ExampleNewUser } from './mocks/index.js';
import { getLoginResult, hasChainSubmissions } from './response.js';
import { cryptoWaitReady } from '@polkadot/util-crypto';

global.fetch = vi.fn();

beforeAll(async () => {
  await cryptoWaitReady();
});

describe('getLoginResult', () => {
  it('Can get and validate a login', async () => {
    const example = await ExampleLogin();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode')).to.resolves.toMatchObject(example);
  });

  it('Can get and validate a New User', async () => {
    const example = await ExampleNewUser();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode')).to.resolves.toMatchObject(example);
  });

  it('Can get and validate a New Provider', async () => {
    const example = await ExampleNewProvider();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode')).to.resolves.toMatchObject(example);
  });
});

describe('hasChainSubmissions', () => {
  it('returns true when it has some', async () => {
    expect(hasChainSubmissions(await ExampleNewUser())).toBe(true);
    expect(hasChainSubmissions(await ExampleNewProvider())).toBe(true);
  });

  it('returns false when it has none', async () => {
    const loginResponse = await ExampleLogin();
    expect(hasChainSubmissions(loginResponse)).toBe(false);
    loginResponse.payloads = [];
    expect(hasChainSubmissions(loginResponse)).toBe(false);
  });
});
