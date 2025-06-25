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
import { createSiwfSignedRequestPayload, HexString, verifySignature } from '@frequency-chain/ethereum-utils';

const stockCredentials = [
  {
    anyOf: [VerifiedEmailAddressCredential, VerifiedPhoneNumberCredential],
  },
  VerifiedGraphKeyCredential,
];

const exampleApplicationContext = {
  url: 'https://example.org/myapp/siwf-manifest.json',
};

describe('request', () => {
  it('correctly generates the signed request Sr25519', async () => {
    const generated = await generateSignedRequest(
      'base58',
      'ss58',
      'Sr25519',
      '//Alice',
      'http://localhost:3000',
      [1, 2, 100],
      stockCredentials,
      exampleApplicationContext
    );

    expect(generated).toEqual({
      requestedSignatures: {
        publicKey: {
          encodedValue: 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH',
          encoding: 'base58',
          format: 'ss58',
          type: 'Sr25519',
        },
        signature: {
          algo: 'SR25519',
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
      applicationContext: exampleApplicationContext,
    });
  });

  it('correctly generates the signed request Secp256k1', async () => {
    const generated = await generateSignedRequest(
      'base16',
      'eip-55',
      'Secp256k1',
      '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
      'http://localhost:3000',
      [1, 2, 100],
      stockCredentials,
      exampleApplicationContext
    );

    expect(generated).toEqual({
      requestedSignatures: {
        publicKey: {
          encodedValue: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
          encoding: 'base16',
          format: 'eip-55',
          type: 'Secp256k1',
        },
        signature: {
          algo: 'SECP256K1',
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
      applicationContext: exampleApplicationContext,
    });
  });

  it('correctly generates the signature Sr25519', async () => {
    const generated = await generateSignedRequest(
      'base58',
      'ss58',
      'Sr25519',
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

  it('correctly generates the signature Secp256k1', async () => {
    const generated = await generateSignedRequest(
      'base16',
      'eip-55',
      'Secp256k1',
      '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
      'http://localhost:3000',
      [5, 7, 8, 9, 10],
      stockCredentials
    );

    const signature = generated.requestedSignatures.signature.encodedValue;

    const verified = verifySignature(
      '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
      signature as HexString,
      createSiwfSignedRequestPayload('http://localhost:3000', [5, 7, 8, 9, 10])
    );

    expect(verified).toBeTruthy();
  });

  it('Can encode and decode successfully Sr25519', async () => {
    const encoded = await generateEncodedSignedRequest(
      'base58',
      'ss58',
      'Sr25519',
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

  it('Can encode and decode successfully Secp256k1', async () => {
    const encoded = await generateEncodedSignedRequest(
      'base16',
      'eip-55',
      'Secp256k1',
      '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
      'http://localhost:3000',
      [5, 7, 8, 9, 10],
      stockCredentials
    );

    expect(decodeSignedRequest(encoded)).toMatchObject({
      requestedSignatures: {
        publicKey: {
          encodedValue: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
          encoding: 'base16',
          format: 'eip-55',
          type: 'Secp256k1',
        },
      },
    });
  });
});
