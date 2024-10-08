import { Struct, Text } from '@polkadot/types-codec';
import { TypeRegistry } from '@polkadot/types';
import type { RegistryTypes } from '@polkadot/types/types';
import { SiwfSignedRequest } from './types/request.js';
import { u8aToHex, u8aWrapBytes } from '@polkadot/util';
import {
  SiwfResponsePayloadAddProvider,
  SiwfResponsePayloadClaimHandle,
  SiwfResponsePayloadItemActions,
} from './types/payload.js';
const registry = new TypeRegistry();

const frequencyTypes: RegistryTypes = {
  PalletStatefulStorageItemActionEnumAdd: {
    data: 'Bytes',
  },
  PalletStatefulStorageItemActionEnumDelete: {
    index: 'u16',
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

export function serializeAddProviderPayloadHex(payload: SiwfResponsePayloadAddProvider['payload']): string {
  return u8aToHex(u8aWrapBytes(registry.createType('PalletMsaAddProvider', payload).toU8a()));
}

export function serializeItemActionsPayloadHex(payload: SiwfResponsePayloadItemActions['payload']): string {
  return u8aToHex(
    u8aWrapBytes(
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
    )
  );
}

export function serializeClaimHandlePayloadHex(payload: SiwfResponsePayloadClaimHandle['payload']): string {
  return u8aToHex(u8aWrapBytes(registry.createType('CommonPrimitivesHandlesClaimHandlePayload', payload).toU8a()));
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
