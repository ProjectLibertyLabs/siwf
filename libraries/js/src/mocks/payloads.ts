import { u8aToHex } from '@polkadot/util';
import {
  SiwfResponsePayloadAddProvider,
  SiwfResponsePayloadClaimHandle,
  SiwfResponsePayloadItemActions,
  SiwfResponsePayloadLogin,
} from '../types/payload.js';
import { ExampleUserKeySr25519 } from './keys.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
} from '../util.js';
import { ExampleUserPublicKeySecp256k1 } from './index.js';
import { createSiwfLoginRequestPayload, sign } from '@frequency-chain/ethereum-utils';

function generateLoginMessage(account: string, issued: Date, expires: Date, uri: URL) {
  return `${uri.hostname} wants you to sign in with your Frequency account:\n${account}\n\n\n\nURI: ${uri}\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: ${issued.toISOString()}\nExpiration Time: ${expires.toISOString()}`;
}

// Setup now so that it is consistent for the entire test run
const now = Date.now();

const loginMessageUrlSr25519 = (url: string) =>
  generateLoginMessage(
    ExampleUserKeySr25519.public,
    new Date(now - 24 * 60 * 60 * 1000),
    new Date(now + 24 * 60 * 60 * 1000),
    new URL(url)
  );

const loginMessageUrlSecp256k1 = (url: string) =>
  generateLoginMessage(
    ExampleUserPublicKeySecp256k1.encodedValue,
    new Date(now - 24 * 60 * 60 * 1000),
    new Date(now + 24 * 60 * 60 * 1000),
    new URL(url)
  );

const loginMessageGoodSr25519 = () => loginMessageUrlSr25519('https://your-app.com/signin/callback');

const loginMessageGoodSecp256k1 = () => loginMessageUrlSecp256k1('https://your-app.com/signin/callback');

const loginMessageExpiredSr25519 = () =>
  generateLoginMessage(
    ExampleUserKeySr25519.public,
    new Date(now - 2 * 24 * 60 * 60 * 1000),
    new Date(now - 24 * 60 * 60 * 1000),
    new URL('https://your-app.com/signin/callback')
  );

const loginMessageExpiredSecp256k1 = () =>
  generateLoginMessage(
    ExampleUserPublicKeySecp256k1.encodedValue,
    new Date(now - 2 * 24 * 60 * 60 * 1000),
    new Date(now - 24 * 60 * 60 * 1000),
    new URL('https://your-app.com/signin/callback')
  );

export const ExamplePayloadLoginUrlSr25519 = (url: string): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKeySr25519.keyPair().sign(loginMessageUrlSr25519(url))),
  },
  type: 'login',
  payload: {
    message: loginMessageUrlSr25519(url),
  },
});

export const ExamplePayloadLoginUrlSecp256k1 = async (url: string): Promise<SiwfResponsePayloadLogin> => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue: (
      await sign(
        '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
        createSiwfLoginRequestPayload(loginMessageUrlSecp256k1(url))
      )
    ).Ecdsa,
  },
  type: 'login',
  payload: {
    message: loginMessageUrlSecp256k1(url),
  },
});

export const ExamplePayloadLoginGoodSr25519 = (): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKeySr25519.keyPair().sign(loginMessageGoodSr25519())),
  },
  type: 'login',
  payload: {
    message: loginMessageGoodSr25519(),
  },
});

export const ExamplePayloadLoginGoodSecp256k1 = async (): Promise<SiwfResponsePayloadLogin> => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue: (
      await sign(
        '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
        createSiwfLoginRequestPayload(loginMessageGoodSecp256k1())
      )
    ).Ecdsa,
  },
  type: 'login',
  payload: {
    message: loginMessageGoodSecp256k1(),
  },
});

export const ExamplePayloadLoginExpiredSr25519 = (): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKeySr25519.keyPair().sign(loginMessageExpiredSr25519())),
  },
  type: 'login',
  payload: {
    message: loginMessageExpiredSr25519(),
  },
});

export const ExamplePayloadLoginExpiredSecp256k1 = async (): Promise<SiwfResponsePayloadLogin> => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue: (
      await sign(
        '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
        createSiwfLoginRequestPayload(loginMessageExpiredSecp256k1())
      )
    ).Ecdsa,
  },
  type: 'login',
  payload: {
    message: loginMessageExpiredSecp256k1(),
  },
});

export const ExamplePayloadLoginStaticSr25519: SiwfResponsePayloadLogin = {
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue:
      '0xe261698297111834e68b4152bf1f89819e886b6528f6fff45715f7781d0f1e7dc4007ccfed1e85b8c603c0fea2f7abf22bfe6336869ad21f11a09a114452c680',
  },
  type: 'login',
  payload: {
    message:
      'your-app.com wants you to sign in with your Frequency account:\n' +
      'f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ\n' +
      '\n' +
      '\n' +
      '\n' +
      'URI: https://your-app.com/signin/callback\n' +
      'Nonce: N6rLwqyz34oUxJEXJ\n' +
      'Issued At: 2024-10-29T19:17:27.077Z\n' +
      'Expiration Time: 2060-03-05T23:23:03.041Z',
  },
};

export const ExamplePayloadLoginStaticSecp256k1: SiwfResponsePayloadLogin = {
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue:
      '0x986f4c0e365fce4a2f5a05f9fb306d79ac918fc07745399f517eb29b8cde5d097cdab7501b8ab1f0f5912f86682ba67365b0b97478995dbec08986d0fbe5f4f71b',
  },
  type: 'login',
  payload: {
    message:
      'your-app.com wants you to sign in with your Frequency account:\n' +
      '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac\n' +
      '\n' +
      '\n' +
      '\n' +
      'URI: https://your-app.com/signin/callback\n' +
      'Nonce: N6rLwqyz34oUxJEXJ\n' +
      'Issued At: 2024-10-29T19:17:27.077Z\n' +
      'Expiration Time: 2060-03-05T23:23:03.041Z',
  },
};

// Signed by ExampleUserKey
export const ExamplePayloadCreateSponsoredAccountSr25519 = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKeySr25519.keyPair().sign(
        serializeAddProviderPayloadHex('Sr25519', {
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 24,
        }) as Uint8Array
      )
    ),
  },
  endpoint: {
    pallet: 'msa',
    extrinsic: 'createSponsoredAccountWithDelegation',
  },
  type: 'addProvider',
  payload: {
    authorizedMsaId: 1,
    schemaIds: [5, 7, 8, 9, 10],
    expiration: 24,
  },
});

export const ExamplePayloadCreateSponsoredAccountSecp256k1 = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue:
      '0xb3e41e53373649d089455965791c47f695f519eb21bd322febf04bd05f2b50b72c395c4490ac6cd0d108d0a77f625aea8b1f0096befc359936669d620f5aad7e1c',
  },
  endpoint: {
    pallet: 'msa',
    extrinsic: 'createSponsoredAccountWithDelegation',
  },
  type: 'addProvider',
  payload: {
    authorizedMsaId: 1,
    schemaIds: [5, 7, 8, 9, 10],
    expiration: 24,
  },
});

// Signed by ExampleUserKey
export const ExamplePayloadGrantDelegationSr25519 = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKeySr25519.keyPair().sign(
        serializeAddProviderPayloadHex('Sr25519', {
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 24,
        }) as Uint8Array
      )
    ),
  },
  endpoint: {
    pallet: 'msa',
    extrinsic: 'grantDelegation',
  },
  type: 'addProvider',
  payload: {
    authorizedMsaId: 1,
    schemaIds: [5, 7, 8, 9, 10],
    expiration: 24,
  },
});

export const ExamplePayloadGrantDelegationSecp256k1 = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue:
      '0xb3e41e53373649d089455965791c47f695f519eb21bd322febf04bd05f2b50b72c395c4490ac6cd0d108d0a77f625aea8b1f0096befc359936669d620f5aad7e1c',
  },
  endpoint: {
    pallet: 'msa',
    extrinsic: 'grantDelegation',
  },
  type: 'addProvider',
  payload: {
    authorizedMsaId: 1,
    schemaIds: [5, 7, 8, 9, 10],
    expiration: 24,
  },
});

// Signed by ExampleUserKey
export const ExamplePayloadPublicGraphKeySr25519 = (): SiwfResponsePayloadItemActions => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKeySr25519.keyPair().sign(
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
    ),
  },
  endpoint: {
    pallet: 'statefulStorage',
    extrinsic: 'applyItemActionsWithSignatureV2',
  },
  type: 'itemActions',
  payload: {
    schemaId: 7,
    targetHash: 0,
    expiration: 20,
    actions: [
      {
        type: 'addItem',
        payloadHex: '0x40eea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37',
      },
    ],
  },
});

export const ExamplePayloadPublicGraphKeySecp256k1 = (): SiwfResponsePayloadItemActions => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue:
      '0xfd1d273752f6494cf64bc7091b37fce35f1bdd861b676c7f5ee392675453764f2e322797b6a5f676e6716738c5ba8fabe82de83dbe5bf9d9e771ef717ff036241c',
  },
  endpoint: {
    pallet: 'statefulStorage',
    extrinsic: 'applyItemActionsWithSignatureV2',
  },
  type: 'itemActions',
  payload: {
    schemaId: 7,
    targetHash: 0,
    expiration: 20,
    actions: [
      {
        type: 'addItem',
        payloadHex: '0x40eea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37',
      },
    ],
  },
});

// Signed by ExampleUserKey
export const ExamplePayloadClaimHandleSr25519 = (): SiwfResponsePayloadClaimHandle => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKeySr25519.keyPair().sign(
        serializeClaimHandlePayloadHex('Sr25519', {
          baseHandle: 'ExampleHandle',
          expiration: 24,
        }) as Uint8Array
      )
    ),
  },
  endpoint: {
    pallet: 'handles',
    extrinsic: 'claimHandle',
  },
  type: 'claimHandle',
  payload: {
    baseHandle: 'ExampleHandle',
    expiration: 24,
  },
});

export const ExamplePayloadClaimHandleSecp256k1 = (): SiwfResponsePayloadClaimHandle => ({
  signature: {
    algo: 'SECP256K1',
    encoding: 'base16',
    encodedValue:
      '0xeaa194e6f0074d777633522370fc0f74b200d933e1f1219bc8379ace1fb42759463e7b71d796abf839f2c1f78ecd0af4872010300afac4fbdb44d584c4686e041b',
  },
  endpoint: {
    pallet: 'handles',
    extrinsic: 'claimHandle',
  },
  type: 'claimHandle',
  payload: {
    baseHandle: 'ExampleHandle',
    expiration: 24,
  },
});
