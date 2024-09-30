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

    await expect(validateCredentials([emailCred], [])).resolves.toBeUndefined();
  });

  it('Can verify email with trusted issuers', async () => {
    await expect(
      validateCredentials([await ExampleEmailCredential()], ['did:web:frequencyaccess.com'])
    ).resolves.toBeUndefined();
  });

  it('Can fail email with trusted issuers and bad expiration date', async () => {
    const cred = await ExampleEmailCredential();
    cred.proof.expirationDate = new Date('2000-01-01').toISOString();
    await expect(validateCredentials([cred], ['did:web:frequencyaccess.com'])).rejects.toThrowError(
      'Credential Expired: 2000-01-01T00:00:00.000Z'
    );
  });

  it('Can fail email with trusted issuers and bad valid until date', async () => {
    const cred = await ExampleEmailCredential();
    cred.proof.validUntil = new Date('2000-01-01').toISOString();
    await expect(validateCredentials([cred], ['did:web:frequencyaccess.com'])).rejects.toThrowError(
      'Credential Expired: 2000-01-01T00:00:00.000Z'
    );
  });

  it('Can verify phone with trusted issuers', async () => {
    await expect(
      validateCredentials([await ExamplePhoneCredential()], ['did:web:frequencyaccess.com'])
    ).resolves.toBeUndefined();
  });

  it('Can fail phone with trusted issuers but bad proof', async () => {
    const cred = await ExamplePhoneCredential();
    cred.proof.proofValue += 'F';
    await expect(validateCredentials([cred], ['did:web:frequencyaccess.com'])).rejects.toThrowError(
      'Unable to validate credential (VerifiedPhoneNumberCredential, VerifiableCredential). VerificationError:Error: Invalid signature.'
    );
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
      validateCredentials(
        [await ExampleEmailCredential(), await ExamplePhoneCredential(), await ExampleUserGraphCredential()],
        ['did:web:frequencyaccess.com']
      )
    ).resolves.toBeUndefined();
  });

  it('Can verify nothing', async () => {
    await expect(validateCredentials([])).resolves.toBeUndefined();
  });
});
