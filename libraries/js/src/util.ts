import { Struct, Text } from '@polkadot/types-codec';
import { TypeRegistry } from '@polkadot/types';
import type { RegistryTypes } from '@polkadot/types/types';
import { SiwfSignedRequest } from './types/request.js';
import { u8aToHex, u8aWrapBytes } from '@polkadot/util';
import {
  SiwfResponsePayloadAddProvider,
  SiwfResponsePayloadClaimHandle,
  SiwfResponsePayloadItemActions,
  SiwfResponsePayloadRecoveryCommitment,
} from './types/payload.js';
import { AlgorithmType, CurveType, SignedPayload } from './types';
import {
  createAddProvider,
  createClaimHandlePayload,
  createItemizedAddAction,
  createItemizedSignaturePayloadV2,
  createRecoveryCommitmentPayload,
  HexString,
} from '@frequency-chain/ethereum-utils';
const registry = new TypeRegistry();

const frequencyTypes: RegistryTypes = {
  PalletStatefulStorageItemActionEnumAdd: {
    data: 'Bytes',
  },
  PalletStatefulStorageItemActionEnumDelete: {
    index: 'u16',
  },
  PalletMsaPayloadTypeDiscriminator: {
    _enum: ['Unknown', 'AuthorizedKeyData', 'RecoveryCommitmentPayload'],
  },
  PalletStatefulStorageItemAction: {
    _enum: {
      Add: '<PalletStatefulStorageItemActionEnumAdd>',
      Delete: '<PalletStatefulStorageItemActionEnumDelete>',
    },
  },
  PalletStatefulStorageItemizedSignaturePayloadV2: {
    schemaId: 'Compact<u16>',
    targetHash: 'Compact<u32>',
    expiration: 'u32',
    actions: 'Vec<PalletStatefulStorageItemAction>',
  },
  PalletMsaAddProvider: {
    authorizedMsaId: 'u64',
    schemaIds: 'Vec<u16>',
    expiration: 'u32',
  },
  PalletMsaRecoveryCommitmentPayload: {
    discriminant: 'PalletMsaPayloadTypeDiscriminator',
    recoveryCommitment: '[u8;32]',
    expiration: 'u32',
  },
  CommonPrimitivesHandlesClaimHandlePayload: {
    baseHandle: 'Bytes',
    expiration: 'u32',
  },
};

registry.register(frequencyTypes);

export function requestPayloadBytes(payload: SiwfSignedRequest['requestedSignatures']['payload']): Uint8Array {
  return new Struct(
    registry,
    {
      callback: Text,
      permissions: 'Vec<U16>',
      userIdentifierAdminUrl: 'Option<Text>',
    },
    // Ensure that the userIdentifierAdminUrl is null if it doesn't exist
    { userIdentifierAdminUrl: null, ...payload }
  ).toU8a();
}

export function serializeLoginPayloadHex(payload: SiwfSignedRequest['requestedSignatures']['payload']): string {
  return u8aToHex(u8aWrapBytes(requestPayloadBytes(payload)));
}

export function serializeAddProviderPayloadHex(
  curveType: CurveType,
  payload: SiwfResponsePayloadAddProvider['payload']
): SignedPayload {
  switch (curveType) {
    case 'Sr25519':
      return u8aWrapBytes(registry.createType('PalletMsaAddProvider', payload).toU8a());

    case 'Secp256k1':
      return createAddProvider(payload.authorizedMsaId.toString(), payload.schemaIds, payload.expiration);

    default:
      throw new Error(`${curveType} is not supported!`);
  }
}

export function serializeItemActionsPayloadHex(
  curveType: CurveType,
  payload: SiwfResponsePayloadItemActions['payload']
): SignedPayload {
  switch (curveType) {
    case 'Sr25519':
      return u8aWrapBytes(
        registry
          .createType('PalletStatefulStorageItemizedSignaturePayloadV2', {
            schemaId: payload.schemaId,
            targetHash: payload.targetHash,
            expiration: payload.expiration,
            actions: payload.actions.map((action) => {
              switch (action.type) {
                case 'addItem':
                  return { Add: action.payloadHex };
              }
              throw new Error(`Unable to parse payload action for ItemActions: ${JSON.stringify(action)}`);
            }),
          })
          .toU8a()
      );

    case 'Secp256k1':
      return createItemizedSignaturePayloadV2(
        payload.schemaId,
        payload.targetHash,
        payload.expiration,
        payload.actions.map((action) => {
          switch (action.type) {
            case 'addItem':
              return createItemizedAddAction(action.payloadHex as HexString);
          }
          throw new Error(`Unable to parse payload action for ItemActions: ${JSON.stringify(action)}`);
        })
      );

    default:
      throw new Error(`${curveType} is not supported!`);
  }
}

export function serializeClaimHandlePayloadHex(
  curveType: CurveType,
  payload: SiwfResponsePayloadClaimHandle['payload']
): SignedPayload {
  switch (curveType) {
    case 'Sr25519':
      return u8aWrapBytes(registry.createType('CommonPrimitivesHandlesClaimHandlePayload', payload).toU8a());
    case 'Secp256k1':
      return createClaimHandlePayload(payload.baseHandle, payload.expiration);
    default:
      throw new Error(`${curveType} is not supported!`);
  }
}

export function serializeRecoveryCommitmentPayloadHex(
  curveType: CurveType,
  payload: SiwfResponsePayloadRecoveryCommitment['payload']
): SignedPayload {
  switch (curveType) {
    case 'Sr25519':
      return u8aWrapBytes(
        registry
          .createType('PalletMsaRecoveryCommitmentPayload', {
            discriminant: 'RecoveryCommitmentPayload',
            recoveryCommitment: payload.recoveryCommitmentHex,
            expiration: payload.expiration,
          })
          .toU8a()
      );
    case 'Secp256k1':
      return createRecoveryCommitmentPayload(payload.recoveryCommitmentHex as HexString, payload.expiration);
    default:
      throw new Error(`${curveType} is not supported!`);
  }
}

export function parseEndpoint(input = 'mainnet', path: '/start' | '/api/payload') {
  switch (input) {
    case 'mainnet':
    case 'production':
    case 'prod':
      return 'https://www.frequencyaccess.com/siwa' + path;
    case 'testnet':
    case 'staging':
      return 'https://testnet.frequencyaccess.com/siwa' + path;
    default:
      return input.replace(/\/$/, '') + path;
  }
}

export function getAlgorithmForCurveType(keyType: CurveType): AlgorithmType {
  switch (keyType) {
    case 'Sr25519':
      return 'SR25519';
    case 'Secp256k1':
      return 'SECP256K1';
    default:
      throw new Error(`${keyType} is not supported!`);
  }
}
