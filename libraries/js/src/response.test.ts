import { describe, it, vi, expect, beforeAll } from 'vitest';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import base64url from 'base64url';
import { ExampleLogin, ExampleNewProvider, ExampleNewUser } from './mocks/index.js';
import { getLoginResult, hasChainSubmissions, validateSiwfResponse } from './response.js';

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

    await expect(getLoginResult('fakeAuthCode', { loginMsgDomain: 'localhost' })).to.resolves.toMatchObject(example);
  });

  it('Can get and validate a New User', async () => {
    const example = await ExampleNewUser();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode', { loginMsgDomain: 'localhost' })).to.resolves.toMatchObject(example);
  });

  it('Can get and validate a New Provider', async () => {
    const example = await ExampleNewProvider();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode', { loginMsgDomain: 'localhost' })).to.resolves.toMatchObject(example);
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

describe('validateSiwfResponse', () => {
  it('can handle a JSON strigified base64url encoded value', async () => {
    const example = await ExampleLogin();
    await expect(validateSiwfResponse(base64url(JSON.stringify(example)), 'localhost')).to.resolves.toMatchObject(
      example
    );
  });

  it('can handle an object value', async () => {
    const example = await ExampleLogin();
    await expect(validateSiwfResponse(example, 'localhost')).to.resolves.toMatchObject(example);
  });

  it('throws on a null value', async () => {
    await expect(validateSiwfResponse(null, 'localhost')).to.rejects.toThrowError(
      'Response failed to correctly parse or invalid content: null'
    );
  });

  it('throws on a bad string value', async () => {
    const value = base64url(JSON.stringify({ foo: 'bad' }));
    await expect(validateSiwfResponse(value, 'localhost')).to.rejects.toThrowError(
      'Response failed to correctly parse or invalid content: {"foo":"bad"}'
    );
  });
});
