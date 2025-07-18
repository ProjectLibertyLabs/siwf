import { describe, expect, it } from 'vitest';
import {
  serializeLoginPayloadHex,
  parseEndpoint,
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
  serializeRecoveryCommitmentPayloadHex,
} from './util.js';
import { u8aToHex } from '@polkadot/util';

describe('SCALE serializations', () => {
  it('serializeLoginPayloadHex serializes correctly', () => {
    expect(serializeLoginPayloadHex({ callback: 'https://localhost:44181', permissions: [5, 7, 8, 9, 10] })).toEqual(
      '0x3c42797465733e5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a00003c2f42797465733e'
    );

    expect(
      serializeLoginPayloadHex({
        callback: 'https://localhost:44181',
        permissions: [5, 7, 8, 9, 10],
        userIdentifierAdminUrl: 'https://localhost:101010',
      })
    ).toEqual(
      '0x3c42797465733e5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a00016068747470733a2f2f6c6f63616c686f73743a3130313031303c2f42797465733e'
    );

    expect(serializeLoginPayloadHex({ callback: 'https://localhost:44181', permissions: [5, 7, 8, 9, 10] })).toEqual(
      '0x3c42797465733e5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a00003c2f42797465733e'
    );
  });

  it('serializeAddProviderPayloadHex serializes correctly', () => {
    expect(
      u8aToHex(
        serializeAddProviderPayloadHex('Sr25519', {
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 24,
        }) as Uint8Array
      )
    ).toEqual('0x3c42797465733e01000000000000001405000700080009000a00180000003c2f42797465733e');
  });

  it('serializeItemActionsPayloadHex serializes correctly', () => {
    expect(
      u8aToHex(
        serializeItemActionsPayloadHex('Sr25519', {
          schemaId: 7,
          targetHash: 0,
          expiration: 20,
          actions: [
            {
              type: 'addItem',
              payloadHex: '0x40eea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37',
            },
          ],
        }) as Uint8Array
      )
    ).toEqual('0x3c42797465733e1c001400000004003c2f42797465733e');
  });

  it('serializeClaimHandlePayloadHex serializes correctly', () => {
    expect(
      u8aToHex(
        serializeClaimHandlePayloadHex('Sr25519', { baseHandle: 'cassandre', expiration: 4576367 }) as Uint8Array
      )
    ).toEqual('0x3c42797465733e2463617373616e6472656fd445003c2f42797465733e');
  });

  it('serializeRecoveryCommitmentPayloadHex serializes correctly', () => {
    expect(
      u8aToHex(
        serializeRecoveryCommitmentPayloadHex('Sr25519', {
          recoveryCommitmentHex: '0x5c06ce60a2a1245fabdd1c11bfbf55246836d2c6fefac2c634837e3359d0dbb3',
          expiration: 100,
        }) as Uint8Array
      )
    ).toEqual(
      '0x3c42797465733e025c06ce60a2a1245fabdd1c11bfbf55246836d2c6fefac2c634837e3359d0dbb3640000003c2f42797465733e'
    );
  });
});

describe('parseEndpoint', () => {
  it('parses keywords', () => {
    expect(parseEndpoint('mainnet', '/start')).toEqual('https://www.frequencyaccess.com/siwa/start');
    expect(parseEndpoint('production', '/api/payload')).toEqual('https://www.frequencyaccess.com/siwa/api/payload');
    expect(parseEndpoint('prod', '/start')).toEqual('https://www.frequencyaccess.com/siwa/start');
    expect(parseEndpoint('testnet', '/api/payload')).toEqual('https://testnet.frequencyaccess.com/siwa/api/payload');
    expect(parseEndpoint('staging', '/start')).toEqual('https://testnet.frequencyaccess.com/siwa/start');
  });

  it('returns custom endpoint', () => {
    expect(parseEndpoint('https://mainnet.frequencyaccess.com', '/start')).toEqual(
      'https://mainnet.frequencyaccess.com/start'
    );
    expect(parseEndpoint('http://localhost', '/start')).toEqual('http://localhost/start');
    expect(parseEndpoint('http://localhost:3000/something/else/', '/api/payload')).toEqual(
      'http://localhost:3000/something/else/api/payload'
    );
  });

  it('strips ending / from the custom endpoint', () => {
    expect(parseEndpoint('https://mainnet.frequencyaccess.com/', '/start')).toEqual(
      'https://mainnet.frequencyaccess.com/start'
    );
    expect(parseEndpoint('http://localhost:3000/', '/api/payload')).toEqual('http://localhost:3000/api/payload');
  });
});
