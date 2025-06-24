import { describe, it, vi, expect, beforeAll } from 'vitest';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import base64url from 'base64url';
import { ExampleLoginSr25519, ExampleNewProviderSr25519, ExampleNewUserSr25519 } from './mocks/index.js';
import { getLoginResult, hasChainSubmissions, validateSiwfResponse } from './response.js';

global.fetch = vi.fn();

beforeAll(async () => {
  await cryptoWaitReady();
});

describe('getLoginResult', () => {
  it('Can get and validate a login', async () => {
    const example = await ExampleLoginSr25519();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(
      getLoginResult('fakeAuthCode', { loginMsgUri: 'your-app.com', endpoint: 'mainnet' })
    ).to.resolves.toMatchObject(example);
  });

  it('Can get and validate a New User', async () => {
    const example = await ExampleNewUserSr25519();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode', { loginMsgUri: 'localhost', endpoint: 'mainnet' })).to.resolves.toMatchObject(
      example
    );
  });

  it('Can get and validate a New Provider', async () => {
    const example = await ExampleNewProviderSr25519();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(example),
      text: () => Promise.resolve('MOCK'),
    } as any);

    await expect(getLoginResult('fakeAuthCode', { loginMsgUri: 'localhost', endpoint: 'mainnet' })).to.resolves.toMatchObject(
      example
    );
  });
});

describe('hasChainSubmissions', () => {
  it('returns true when it has some', async () => {
    expect(hasChainSubmissions(await ExampleNewUserSr25519())).toBe(true);
    expect(hasChainSubmissions(await ExampleNewProviderSr25519())).toBe(true);
  });

  it('returns false when it has none', async () => {
    const loginResponse = await ExampleLoginSr25519();
    expect(hasChainSubmissions(loginResponse)).toBe(false);
    loginResponse.payloads = [];
    expect(hasChainSubmissions(loginResponse)).toBe(false);
  });
});

describe('validateSiwfResponse', () => {
  it('can handle a JSON strigified base64url encoded value', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(base64url(JSON.stringify(example)), { loginMsgUri: 'your-app.com', endpoint: '' })
    ).to.resolves.toMatchObject(example);
  });

  it('can handle an object value', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(example, { loginMsgUri: 'your-app.com', endpoint: '' })
    ).to.resolves.toMatchObject(example);
  });

  it('throws on a null value', async () => {
    await expect(validateSiwfResponse(null, { loginMsgUri: 'localhost', endpoint: '' })).to.rejects.toThrowError(
      'Response failed to correctly parse or invalid content: null'
    );
  });

  it('throws on a bad string value', async () => {
    const value = base64url(JSON.stringify({ foo: 'bad' }));
    await expect(validateSiwfResponse(value, { loginMsgUri: 'localhost', endpoint: '' })).to.rejects.toThrowError(
      'Response failed to correctly parse or invalid content: {"foo":"bad"}'
    );
  });

  it('throws on a bad domain', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(base64url(JSON.stringify(example)), { loginMsgUri: 'bad.example.xyz', endpoint: '' })
    ).to.rejects.toThrowError('Message does not match expected domain. Domain: your-app.com Expected: bad.example.xyz');
  });

  it('throws on a bad scheme in domain', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(base64url(JSON.stringify(example)), { loginMsgUri: 'example://login', endpoint: '' })
    ).to.rejects.toThrowError(
      'Message does not match expected domain. Domain scheme mismatch. Scheme: https Expected: example'
    );
  });

  it('throws on a bad path in domain', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(base64url(JSON.stringify(example)), { loginMsgUri: 'your-app.com/login', endpoint: '' })
    ).to.rejects.toThrowError(
      'Message does not match expected domain. Domain path mismatch. Path: signin Expected: login'
    );
  });

  it('throws on a bad protocol in domain', async () => {
    const example = await ExampleLoginSr25519();
    await expect(
      validateSiwfResponse(base64url(JSON.stringify(example)), { loginMsgUri: 'http://your-app.com', endpoint: '' })
    ).to.rejects.toThrowError(
      'Message does not match expected domain. Domain scheme mismatch. Scheme: https Expected: http'
    );
  });
});
