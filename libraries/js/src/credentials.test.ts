import { describe, it, vi, expect, beforeAll } from 'vitest';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { validateCredentials } from './credentials.js';
import { ExampleEmailCredential, ExamplePhoneCredential, ExampleUserGraphCredential } from './mocks/credentials.js';
import { ExampleFrequencyAccessDidDocument } from './mocks/index.js';

global.fetch = vi.fn();

beforeAll(async () => {
  await cryptoWaitReady();
});

describe('validateCredential', () => {
  it('Can verify a basic email with fetch', async () => {
    const emailCred = await ExampleEmailCredential();

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(ExampleFrequencyAccessDidDocument()),
    } as any);

    await expect(validateCredentials([emailCred])).resolves.toBeUndefined();
  });

  it('Can verify email with trusted issuers', async () => {
    await expect(validateCredentials([await ExampleEmailCredential()])).resolves.toBeUndefined();
  });

  it('Can verify phone with trusted issuers', async () => {
    await expect(validateCredentials([await ExamplePhoneCredential()])).resolves.toBeUndefined();
  });

  it('Can verify graph', async () => {
    await expect(validateCredentials([await ExampleUserGraphCredential()])).resolves.toBeUndefined();
  });

  it('Can fail graph with a bad key', async () => {
    const cred = await ExampleUserGraphCredential();
    cred.credentialSubject.encodedPublicKeyValue += '01';
    await expect(validateCredentials([cred])).rejects.toThrowError('VerifiedGraphKeyCredential: Invalid KeyPair');
  });

  it('Can verify all at once', async () => {
    await expect(
      validateCredentials([
        await ExampleEmailCredential(),
        await ExamplePhoneCredential(),
        await ExampleUserGraphCredential(),
      ])
    ).resolves.toBeUndefined();
  });

  it('Can verify nothing', async () => {
    await expect(validateCredentials([])).resolves.toBeUndefined();
  });
});
