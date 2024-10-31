import { u8aToHex } from '@polkadot/util';
import {
  SiwfResponsePayloadAddProvider,
  SiwfResponsePayloadClaimHandle,
  SiwfResponsePayloadItemActions,
  SiwfResponsePayloadLogin,
} from '../types/payload.js';
import { ExampleUserKey } from './keys.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
} from '../util.js';

function generateLoginMessage(account: string, issued: Date, expires: Date, uri: URL) {
  return `${uri.hostname} wants you to sign in with your Frequency account:\n${account}\n\n\n\nURI: ${uri}\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: ${issued.toISOString()}\nExpiration Time: ${expires.toISOString()}`;
}

// Setup now so that it is consistent for the entire test run
const now = Date.now();

const loginMessageUrl = (url: string) =>
  generateLoginMessage(
    ExampleUserKey.public,
    new Date(now - 24 * 60 * 60 * 1000),
    new Date(now + 24 * 60 * 60 * 1000),
    new URL(url)
  );

const loginMessageGood = () => loginMessageUrl('https://your-app.com/signin/callback');

const loginMessageExpired = () =>
  generateLoginMessage(
    ExampleUserKey.public,
    new Date(now - 2 * 24 * 60 * 60 * 1000),
    new Date(now - 24 * 60 * 60 * 1000),
    new URL('https://your-app.com/signin/callback')
  );

export const ExamplePayloadLoginUrl = (url: string): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKey.keyPair().sign(loginMessageUrl(url))),
  },
  type: 'login',
  payload: {
    message: loginMessageUrl(url),
  },
});

export const ExamplePayloadLoginGood = (): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKey.keyPair().sign(loginMessageGood())),
  },
  type: 'login',
  payload: {
    message: loginMessageGood(),
  },
});

export const ExamplePayloadLoginExpired = (): SiwfResponsePayloadLogin => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKey.keyPair().sign(loginMessageExpired())),
  },
  type: 'login',
  payload: {
    message: loginMessageExpired(),
  },
});

export const ExamplePayloadLoginStatic: SiwfResponsePayloadLogin = {
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

// Signed by ExampleUserKey
export const ExamplePayloadCreateSponsoredAccount = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKey.keyPair().sign(
        serializeAddProviderPayloadHex({
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 24,
        })
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

// Signed by ExampleUserKey
export const ExamplePayloadGrantDelegation = (): SiwfResponsePayloadAddProvider => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKey.keyPair().sign(
        serializeAddProviderPayloadHex({
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 24,
        })
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

// Signed by ExampleUserKey
export const ExamplePayloadPublicGraphKey = (): SiwfResponsePayloadItemActions => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKey.keyPair().sign(
        serializeItemActionsPayloadHex({
          schemaId: 7,
          targetHash: 0,
          expiration: 20,
          actions: [
            {
              type: 'addItem',
              payloadHex: '0x40eea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37',
            },
          ],
        })
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

// Signed by ExampleUserKey
export const ExamplePayloadClaimHandle = (): SiwfResponsePayloadClaimHandle => ({
  signature: {
    algo: 'SR25519',
    encoding: 'base16',
    encodedValue: u8aToHex(
      ExampleUserKey.keyPair().sign(
        serializeClaimHandlePayloadHex({
          baseHandle: 'ExampleHandle',
          expiration: 24,
        })
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
