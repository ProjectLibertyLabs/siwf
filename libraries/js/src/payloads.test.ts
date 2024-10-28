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
    it('Can verify Login Payload generated from FA using hash', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: {
              encodedValue: '5HYHZ8e8kyLEBuEbsFa2bwKYbVSMgaUhymfRVgH7CuM4VCHv',
              encoding: 'base58',
              format: 'ss58',
              type: 'Sr25519',
            },
            payloads: [
              {
                signature: {
                  algo: 'SR25519',
                  encoding: 'base16',
                  encodedValue:
                    '0xa6da6fa47076fbf7b0aac57a246041a777c867d15571dad1fdd014f4f0477a7ca5a92f5c952a740791b4e360b2320e94a3f20e733e821ac4242b1de72fbc6a80',
                },
                type: 'login',
                payload: {
                  message: `localhost wants you to sign in with your Frequency account:
frequency:dev:5HYHZ8e8kyLEBuEbsFa2bwKYbVSMgaUhymfRVgH7CuM4VCHv

URI: http://localhost:3030/login/callback
Version: 1
Nonce: d83eba8e-05a3-4c9a-9901-a976e67278b6
Chain ID: frequency:dev
Issued At: 2024-10-10T18:40:37.344099626Z`,
                },
              },
            ],
          },
          'localhost'
        )
      ).resolves.toBeUndefined();
    });

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

    it('Can verify a Generated Login Payload: app scheme', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('example://login')],
          },
          'example://login'
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: https://example.com/login', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('https://example.com/login')],
          },
          'https://example.com/login'
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: www.example.com/login', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('www.example.com/login')],
          },
          'www.example.com/login'
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: localhost:3030/login/path', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('localhost:3030/login/path')],
          },
          'localhost:3030/login/path'
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
      ).rejects.toThrowError('Message does not match expected domain. Domain: badhost Expected: localhost');

      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('localhost')],
          },
          'betterhost'
        )
      ).rejects.toThrowError('Message does not match expected domain. Domain: localhost Expected: betterhost');
    });

    it('Will fail to verify a Generated Login Payload with an incorrect app scheme', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('not_example://login')],
          },
          'example://login'
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: not_example Expected: example'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect https scheme', async () => {
      // Check the scheme
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('http://example.com/login')],
          },
          'https://example.com/login'
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: http Expected: https'
      );

      // Check the domain
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('https://www.examples.com/login')],
          },
          'https://www.example.com/login'
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );

      // Check the path
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('https://www.example.com/logins')],
          },
          'https://www.example.com/login'
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain path mismatch. Path: logins Expected: login'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect www scheme', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKey,
            payloads: [ExamplePayloadLoginGood('www.examples.com/login')],
          },
          'www.example.com/login'
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );
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
