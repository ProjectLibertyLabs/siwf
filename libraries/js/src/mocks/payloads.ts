import { u8aToHex } from '@polkadot/util';
import {
  SiwaResponsePayloadAddProvider,
  SiwaResponsePayloadClaimHandle,
  SiwaResponsePayloadItemActions,
  SiwaResponsePayloadLogin,
} from '../types/payload.js';
import { ExampleUserKey } from './keys.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
} from '../util.js';

function generateLoginMessage(account: string, issued: Date, expires: Date) {
  return `localhost wants you to sign in with your Frequency account:\n${account}\n\n\n\nURI: https://testnet.frequencyaccess.com/signin/confirm\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: ${issued.toISOString()}\nExpiration Time: ${expires.toISOString()}`;
}

// Setup now so that it is consistent for the entire test run
const now = Date.now();

const loginMessageGood = () =>
  generateLoginMessage(ExampleUserKey.public, new Date(now - 24 * 60 * 60 * 1000), new Date(now + 24 * 60 * 60 * 1000));

const loginMessageExpired = () =>
  generateLoginMessage(
    ExampleUserKey.public,
    new Date(now - 2 * 24 * 60 * 60 * 1000),
    new Date(now - 24 * 60 * 60 * 1000)
  );

export const ExamplePayloadLoginGood = (): SiwaResponsePayloadLogin => ({
  signature: {
    algo: 'Sr25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKey.keyPair().sign(loginMessageGood())),
  },
  type: 'login',
  payload: {
    message: loginMessageGood(),
  },
});

export const ExamplePayloadLoginExpired = (): SiwaResponsePayloadLogin => ({
  signature: {
    algo: 'Sr25519',
    encoding: 'base16',
    encodedValue: u8aToHex(ExampleUserKey.keyPair().sign(loginMessageExpired())),
  },
  type: 'login',
  payload: {
    message: loginMessageExpired(),
  },
});

export const ExamplePayloadLoginStatic: SiwaResponsePayloadLogin = {
  signature: {
    algo: 'Sr25519',
    encoding: 'base16',
    encodedValue:
      '0x84a4e03344b07d64087ebdf47b2c8c679aa7de78179689988992609f1b83c34f6086c7de99ef41c5325cce64d148624e716c605d355f22d1281f6d23f546f584',
  },
  type: 'login',
  payload: {
    message:
      'localhost wants you to sign in with your Frequency account:\nf6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ\n\n\n\nURI: https://testnet.frequencyaccess.com/signin/confirm\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: 2024-03-05T23:18:03.041Z\nExpiration Time: 2060-03-05T23:23:03.041Z',
  },
};

// Signed by ExampleUserKey
export const ExamplePayloadCreateSponsoredAccount = (): SiwaResponsePayloadAddProvider => ({
  signature: {
    algo: 'Sr25519',
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
export const ExamplePayloadGrantDelegation = (): SiwaResponsePayloadAddProvider => ({
  signature: {
    algo: 'Sr25519',
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
export const ExamplePayloadPublicGraphKey = (): SiwaResponsePayloadItemActions => ({
  signature: {
    algo: 'Sr25519',
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
export const ExamplePayloadClaimHandle = (): SiwaResponsePayloadClaimHandle => ({
  signature: {
    algo: 'Sr25519',
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
