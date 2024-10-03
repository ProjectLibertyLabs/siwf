import { describe, it, vi, expect, beforeAll } from 'vitest';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { validatePayloads } from './payloads.js';
import {
  ExamplePayloadClaimHandle,
  ExamplePayloadCreateSponsoredAccount,
  ExamplePayloadGrantDelegation,
  ExamplePayloadLoginGood,
  ExamplePayloadLoginStatic,
  ExamplePayloadPublicGraphKey,
} from './mocks/payloads.js';
import { ExampleUserPublicKey } from './mocks/index.js';
import { ExampleProviderKey } from './mocks/keys.js';

global.fetch = vi.fn();

beforeAll(async () => {
  await cryptoWaitReady();
});

describe('validatePayloads', () => {
  describe('Login Related Payloads', () => {
    it('Can verify a Generated Login Payload', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('localhost')],
          },
          'localhost'
        )
      ).resolves.toBeUndefined();
    });

    it('Will fail to verify a Login Payload with the wrong domain', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('badhost')],
          },
          'localhost'
        )
      ).rejects.toThrowError('Message does not match expected domain. Message: badhost Expected: localhost');

      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('localhost')],
          },
          'betterhost'
        )
      ).rejects.toThrowError('Message does not match expected domain. Message: localhost Expected: betterhost');
    });

    it('Can verify a Static Login Payload', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginStatic],
          },
          'localhost'
        )
      ).resolves.toBeUndefined();
    });
  });

  it('Can verify a ClaimHandle', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [ExamplePayloadClaimHandle()],
        },
        'localhost'
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a ClaimHandle with wrong key', async () => {
    const upk = { ...ExampleUserPublicKey };
    upk.encodedValue = ExampleProviderKey.public;
    await expect(
      validatePayloads(
        {
          userPublicKey: upk,
          payloads: [ExamplePayloadClaimHandle()],
        },
        'localhost'
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify a Create MSA', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [ExamplePayloadCreateSponsoredAccount()],
        },
        'localhost'
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a bad Create MSA with a bad signature', async () => {
    const payload = ExamplePayloadCreateSponsoredAccount();
    payload.signature.encodedValue += 'ff';
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [payload],
        },
        'localhost'
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify a Add Delegation', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [ExamplePayloadGrantDelegation()],
        },
        'localhost'
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a bad Add Delegation with a wrong payload', async () => {
    const payload = ExamplePayloadGrantDelegation();
    payload.payload.authorizedMsaId = 100000;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [payload],
        },
        'localhost'
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify an Add Items', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [ExamplePayloadPublicGraphKey()],
        },
        'localhost'
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail with a wrong Add Items payload', async () => {
    const payload = ExamplePayloadPublicGraphKey();
    payload.payload.schemaId = 1111;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [payload],
        },
        'localhost'
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail with a wrong payload', async () => {
    const payload = ExamplePayloadPublicGraphKey();
    (payload.payload as any) = {};
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKey,
          payloads: [payload],
        },
        'localhost'
      )
    ).rejects.toThrowError('Unknown or Bad Payload: itemActions');
  });
});
