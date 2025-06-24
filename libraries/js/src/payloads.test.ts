import { describe, it, vi, expect, beforeAll } from 'vitest';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { validatePayloads } from './payloads.js';
import {
  ExamplePayloadClaimHandleSecp256k1,
  ExamplePayloadClaimHandleSr25519,
  ExamplePayloadCreateSponsoredAccountSecp256k1,
  ExamplePayloadCreateSponsoredAccountSr25519,
  ExamplePayloadGrantDelegationSecp256k1,
  ExamplePayloadGrantDelegationSr25519,
  ExamplePayloadLoginGoodSecp256k1,
  ExamplePayloadLoginGoodSr25519,
  ExamplePayloadLoginStaticSecp256k1,
  ExamplePayloadLoginStaticSr25519,
  ExamplePayloadLoginUrlSecp256k1,
  ExamplePayloadLoginUrlSr25519,
  ExamplePayloadPublicGraphKeySecp256k1,
  ExamplePayloadPublicGraphKeySr25519,
} from './mocks/payloads.js';
import { ExampleUserPublicKeySecp256k1, ExampleUserPublicKeySr25519 } from './mocks/index.js';
import { ExampleProviderKeySr25519 } from './mocks/keys.js';

global.fetch = vi.fn();

beforeAll(async () => {
  await cryptoWaitReady();
});

describe('validatePayloads', () => {
  describe('Login Related Payloads', () => {
    it('Can verify Login Payload generated from FA using hash Sr25519', async () => {
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
          { loginMsgUri: 'localhost', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify Login Payload generated from FA using hash Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: {
              encodedValue: '0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac',
              encoding: 'base16',
              format: 'eip-55',
              type: 'Secp256k1',
            },
            payloads: [
              {
                signature: {
                  algo: 'SECP256K1',
                  encoding: 'base16',
                  encodedValue:
                    '0xf9f19414eeda82385d3acb4cda73b1dedb18fba7550ead8f46726c0068440b565dd322202870a4287c74e5bbc62039ffec6fbc691df9b1bfe1f0390f050555221b',
                },
                type: 'login',
                payload: {
                  message: `localhost wants you to sign in with your Frequency account:
frequency:dev:0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac

URI: http://localhost:3030/login/callback
Version: 1
Nonce: d83eba8e-05a3-4c9a-9901-a976e67278b6
Chain ID: frequency:dev
Issued At: 2024-10-10T18:40:37.344099626Z`,
                },
              },
            ],
          },
          { loginMsgUri: 'localhost', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginGoodSr25519()],
          },
          { loginMsgUri: 'your-app.com', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginGoodSecp256k1()],
          },
          { loginMsgUri: 'your-app.com', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: app scheme Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('example://login')],
          },
          { loginMsgUri: 'example://login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: app scheme Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('example://login')],
          },
          { loginMsgUri: 'example://login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: https://example.com/login Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('https://example.com/login')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: https://example.com/login Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('https://example.com/login')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: www.example.com/login Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('http://www.example.com/login')],
          },
          { loginMsgUri: 'www.example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: www.example.com/login Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('http://www.example.com/login')],
          },
          { loginMsgUri: 'www.example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: localhost:3030/login/path Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('localhost:3030/login/path')],
          },
          { loginMsgUri: 'localhost:3030/login/path', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload: localhost:3030/login/path Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('localhost:3030/login/path')],
          },
          { loginMsgUri: 'localhost:3030/login/path', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a payload against multiple allowable domains Sr25519', async () => {
      await expect;
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [ExamplePayloadLoginUrlSr25519('http://localhost:3030/login')],
        },
        { loginMsgUri: ['otherdomain/login/callback', 'localhost:3030/login'], endpoint: '' }
      );
    });

    it('Can verify a payload against multiple allowable domains Secp256k1', async () => {
      await expect;
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [await ExamplePayloadLoginUrlSecp256k1('http://localhost:3030/login')],
        },
        { loginMsgUri: ['otherdomain/login/callback', 'localhost:3030/login'], endpoint: '' }
      );
    });

    it('Will fail to verify a Login Payload with the wrong domain Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('http://badhost')],
          },
          { loginMsgUri: 'localhost', endpoint: '' }
        )
      ).rejects.toThrowError('Message does not match expected domain. Domain: badhost Expected: localhost');

      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginGoodSr25519()],
          },
          { loginMsgUri: 'betterhost', endpoint: '' }
        )
      ).rejects.toThrowError('Message does not match expected domain. Domain: your-app.com Expected: betterhost');
    });

    it('Will fail to verify a Login Payload with the wrong domain Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('http://badhost')],
          },
          { loginMsgUri: 'localhost', endpoint: '' }
        )
      ).rejects.toThrowError('Message does not match expected domain. Domain: badhost Expected: localhost');

      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginGoodSecp256k1()],
          },
          { loginMsgUri: 'betterhost', endpoint: '' }
        )
      ).rejects.toThrowError('Message does not match expected domain. Domain: your-app.com Expected: betterhost');
    });

    it('Will fail to verify a Generated Login Payload with an incorrect app scheme Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('notexample://login')],
          },
          { loginMsgUri: 'example://login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: notexample Expected: example'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect app scheme Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('notexample://login')],
          },
          { loginMsgUri: 'example://login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: notexample Expected: example'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect https scheme Sr25519', async () => {
      // Check the scheme
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('http://example.com/login')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: http Expected: https'
      );

      // Check the domain
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('https://www.examples.com/login')],
          },
          { loginMsgUri: 'https://www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );

      // Check the path
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('https://www.example.com/logins')],
          },
          { loginMsgUri: 'https://www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain path mismatch. Path: logins Expected: login'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect https scheme Secp256k1', async () => {
      // Check the scheme
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('http://example.com/login')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain scheme mismatch. Scheme: http Expected: https'
      );

      // Check the domain
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('https://www.examples.com/login')],
          },
          { loginMsgUri: 'https://www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );

      // Check the path
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('https://www.example.com/logins')],
          },
          { loginMsgUri: 'https://www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain path mismatch. Path: logins Expected: login'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect www scheme Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('http://www.examples.com/login')],
          },
          { loginMsgUri: 'www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );
    });

    it('Will fail to verify a Generated Login Payload with an incorrect www scheme Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('http://www.examples.com/login')],
          },
          { loginMsgUri: 'www.example.com/login', endpoint: '' }
        )
      ).rejects.toThrowError(
        'Message does not match expected domain. Domain: www.examples.com Expected: www.example.com'
      );
    });

    it('Can verify a Generated Login Payload with a query string Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginUrlSr25519('https://example.com/login?query=string')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Generated Login Payload with a query string Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [await ExamplePayloadLoginUrlSecp256k1('https://example.com/login?query=string')],
          },
          { loginMsgUri: 'https://example.com/login', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Static Login Payload Sr25519', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySr25519,
            payloads: [ExamplePayloadLoginStaticSr25519],
          },
          { loginMsgUri: 'your-app.com', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });

    it('Can verify a Static Login Payload Secp256k1', async () => {
      await expect(
        validatePayloads(
          {
            userPublicKey: ExampleUserPublicKeySecp256k1,
            payloads: [ExamplePayloadLoginStaticSecp256k1],
          },
          { loginMsgUri: 'your-app.com', endpoint: '' }
        )
      ).resolves.toBeUndefined();
    });
  });

  it('Can verify a ClaimHandle Sr25519', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [ExamplePayloadClaimHandleSr25519()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can verify a ClaimHandle Secp256k1', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [ExamplePayloadClaimHandleSecp256k1()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a ClaimHandle with wrong key Sr25519', async () => {
    const upk = { ...ExampleUserPublicKeySr25519 };
    upk.encodedValue = ExampleProviderKeySr25519.public;
    await expect(
      validatePayloads(
        {
          userPublicKey: upk,
          payloads: [ExamplePayloadClaimHandleSr25519()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail a ClaimHandle with wrong key Secp256k1', async () => {
    const upk = { ...ExampleUserPublicKeySecp256k1 };
    upk.encodedValue = '0xB7c13f4176ca799975D9cce4bafe4814a9D824fa';
    await expect(
      validatePayloads(
        {
          userPublicKey: upk,
          payloads: [ExamplePayloadClaimHandleSecp256k1()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify a Create MSA Sr25519', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [ExamplePayloadCreateSponsoredAccountSr25519()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can verify a Create MSA Secp256k1', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [ExamplePayloadCreateSponsoredAccountSecp256k1()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a bad Create MSA with a bad signature Sr25519', async () => {
    const payload = ExamplePayloadCreateSponsoredAccountSr25519();
    payload.signature.encodedValue += 'ff';
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail a bad Create MSA with a bad signature Secp256k1', async () => {
    const payload = ExamplePayloadCreateSponsoredAccountSecp256k1();
    payload.signature.encodedValue =
      '0xb3e41e53373649d089455965791c47f695f519eb21bd322febf04bd05f2b50b72c395c4490ac6cd0d108d0a77f625aea8b1f0096befc359936669d620f5aad7a2b';
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify a Add Delegation Sr25519', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [ExamplePayloadGrantDelegationSr25519()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can verify a Add Delegation Secp256k1', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [ExamplePayloadGrantDelegationSecp256k1()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail a bad Add Delegation with a wrong payload Sr25519', async () => {
    const payload = ExamplePayloadGrantDelegationSr25519();
    payload.payload.authorizedMsaId = 100000;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail a bad Add Delegation with a wrong payload Secp256k1', async () => {
    const payload = ExamplePayloadGrantDelegationSecp256k1();
    payload.payload.authorizedMsaId = 100000;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can verify an Add Items Sr25519', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [ExamplePayloadPublicGraphKeySr25519()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can verify an Add Items Secp256k1', async () => {
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [ExamplePayloadPublicGraphKeySecp256k1()],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).resolves.toBeUndefined();
  });

  it('Can fail with a wrong Add Items payload Sr25519', async () => {
    const payload = ExamplePayloadPublicGraphKeySr25519();
    payload.payload.schemaId = 1111;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail with a wrong Add Items payload Secp256k1', async () => {
    const payload = ExamplePayloadPublicGraphKeySecp256k1();
    payload.payload.schemaId = 1111;
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Payload signature failed');
  });

  it('Can fail with a wrong payload Sr25519', async () => {
    const payload = ExamplePayloadPublicGraphKeySr25519();
    (payload.payload as any) = {};
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySr25519,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Unknown or Bad Payload: itemActions');
  });

  it('Can fail with a wrong payload Secp256k1', async () => {
    const payload = ExamplePayloadPublicGraphKeySecp256k1();
    (payload.payload as any) = {};
    await expect(
      validatePayloads(
        {
          userPublicKey: ExampleUserPublicKeySecp256k1,
          payloads: [payload],
        },
        { loginMsgUri: 'localhost', endpoint: '' }
      )
    ).rejects.toThrowError('Unknown or Bad Payload: itemActions');
  });
});
