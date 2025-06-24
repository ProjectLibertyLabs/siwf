import { SiwfResponse } from '../types/response.js';
import {
  ExamplePayloadClaimHandleSecp256k1,
  ExamplePayloadClaimHandleSr25519,
  ExamplePayloadCreateSponsoredAccountSecp256k1,
  ExamplePayloadCreateSponsoredAccountSr25519,
  ExamplePayloadGrantDelegationSecp256k1,
  ExamplePayloadGrantDelegationSr25519,
  ExamplePayloadLoginStaticSecp256k1,
  ExamplePayloadLoginStaticSr25519,
  ExamplePayloadPublicGraphKeySecp256k1,
  ExamplePayloadPublicGraphKeySr25519,
} from './payloads.js';
import { ExampleEmailCredential, ExampleUserGraphCredential } from './credentials.js';
import { ExampleProviderKeySr25519, ExampleUserKeySr25519, multibaseEd25519 } from './keys.js';
import { SiwfPublicKey } from '../types/general.js';

export const ExampleUserPublicKeySr25519: SiwfPublicKey = {
  encodedValue: ExampleUserKeySr25519.public,
  encoding: 'base58',
  format: 'ss58',
  type: 'Sr25519',
};

export const ExampleUserPublicKeySecp256k1: SiwfPublicKey = {
  encodedValue: 'f6d1YDa4agkaQ5Kqq8ZKwCf2Ew8UFz9ot2JNrBwHsFkhdtHEn',
  encoding: 'base58',
  format: 'ss58',
  type: 'Secp256k1',
};

// NOTICE: These mocks ALSO generate the `docs/DataStructure/[].md` files. Take care changing them

export const ExampleFrequencyAccessDidDocument = () => ({
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
  id: 'did:web:frequencyaccess.com',
  assertionMethod: [
    {
      id: 'did:web:frequencyaccess.com#' + multibaseEd25519(ExampleProviderKeySr25519.keyPairEd().publicKey),
      type: 'Multikey',
      controller: 'did:web:frequencyaccess.com',
      publicKeyMultibase: multibaseEd25519(ExampleProviderKeySr25519.keyPairEd().publicKey),
    },
  ],
});

export const ExampleLoginSr25519 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySr25519,
  payloads: [ExamplePayloadLoginStaticSr25519],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewUserSr25519 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySr25519,
  payloads: [
    ExamplePayloadCreateSponsoredAccountSr25519(),
    ExamplePayloadPublicGraphKeySr25519(),
    ExamplePayloadClaimHandleSr25519(),
  ],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewProviderSr25519 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySr25519,
  payloads: [ExamplePayloadGrantDelegationSr25519()],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleLoginSecp256k1 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySecp256k1,
  payloads: [ExamplePayloadLoginStaticSecp256k1],
  credentials: [],
});

export const ExampleNewUserSecp256k1 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySecp256k1,
  payloads: [
    ExamplePayloadCreateSponsoredAccountSecp256k1(),
    ExamplePayloadPublicGraphKeySecp256k1(),
    ExamplePayloadClaimHandleSecp256k1(),
  ],
  credentials: [],
});

export const ExampleNewProviderSecp256k1 = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKeySecp256k1,
  payloads: [ExamplePayloadGrantDelegationSecp256k1()],
  credentials: [],
});
