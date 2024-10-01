import { describe, expect, it, vi } from 'vitest';
import { signatureVerify } from '@polkadot/util-crypto';
import {
  decodeSignedRequest,
  generateEncodedSignedRequest,
  generateSignedRequest,
  VerifiedEmailAddressCredential,
  VerifiedGraphKeyCredential,
  VerifiedPhoneNumberCredential,
} from './request.js';
import { serializeLoginPayloadHex } from './util.js';

const stockCredentials = [
  {
    anyOf: [VerifiedEmailAddressCredential, VerifiedPhoneNumberCredential],
  },
  VerifiedGraphKeyCredential,
];

describe('request', () => {
  it('correctly generates the signed request', async () => {
    const generated = await generateSignedRequest('//Alice', 'http://localhost:3000', [1, 2, 100], stockCredentials);

    expect(generated).toEqual({
      requestedSignatures: {
        publicKey: {
          encodedValue: 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH',
          encoding: 'base58',
          format: 'ss58',
          type: 'Sr25519',
        },
        signature: {
          algo: 'Sr25519',
          encoding: 'base16',
          encodedValue: expect.stringMatching(/^0x[a-f0-9]+$/),
        },
        payload: {
          callback: 'http://localhost:3000',
          permissions: [1, 2, 100],
        },
      },
      requestedCredentials: [
        {
          anyOf: [
            {
              type: 'VerifiedEmailAddressCredential',
              hash: ['bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi'],
            },
            {
              type: 'VerifiedPhoneNumberCredential',
              hash: ['bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq'],
            },
          ],
        },
        {
          type: 'VerifiedGraphKeyCredential',
          hash: ['bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y'],
        },
      ],
    });
  });

  it('correctly generates the signature', async () => {
    const generated = await generateSignedRequest(
      '//Alice',
      'http://localhost:3000',
      [5, 7, 8, 9, 10],
      stockCredentials
    );

    const signature = generated.requestedSignatures.signature.encodedValue;

    const verified = signatureVerify(
      serializeLoginPayloadHex({
        callback: 'http://localhost:3000',
        permissions: [5, 7, 8, 9, 10],
      }),
      signature,
      'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH'
    );

    expect(verified.isValid).toBeTruthy();
  });

  it('Can encode and decode successfully', async () => {
    const encoded = await generateEncodedSignedRequest(
      '//Alice',
      'http://localhost:3000',
      [5, 7, 8, 9, 10],
      stockCredentials
    );

    expect(decodeSignedRequest(encoded)).toMatchObject({
      requestedSignatures: {
        publicKey: {
          encodedValue: 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH',
          encoding: 'base58',
          format: 'ss58',
          type: 'Sr25519',
        },
      },
    });
  });
});
