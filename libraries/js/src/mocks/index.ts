import { SiwfResponse } from '../types/response.js';
import {
  ExamplePayloadClaimHandle,
  ExamplePayloadCreateSponsoredAccount,
  ExamplePayloadGrantDelegation,
  ExamplePayloadLoginStatic,
  ExamplePayloadPublicGraphKey,
} from './payloads.js';
import { ExampleEmailCredential, ExampleUserGraphCredential } from './credentials.js';
import { ExampleProviderKey, ExampleUserKey, multibaseEd25519 } from './keys.js';
import { SiwfPublicKey } from '../types/general.js';

export const ExampleUserPublicKey: SiwfPublicKey = {
  encodedValue: ExampleUserKey.public,
  encoding: 'base58',
  format: 'ss58',
  type: 'Sr25519',
};

// NOTICE: These mocks ALSO generate the `docs/DataStructure/[].md` files. Take care changing them

export const ExampleFrequencyAccessDidDocument = () => ({
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
  id: 'did:web:frequencyaccess.com',
  assertionMethod: [
    {
      id: 'did:web:frequencyaccess.com#' + multibaseEd25519(ExampleProviderKey.keyPairEd().publicKey),
      type: 'Multikey',
      controller: 'did:web:frequencyaccess.com',
      publicKeyMultibase: multibaseEd25519(ExampleProviderKey.keyPairEd().publicKey),
    },
  ],
});

export const ExampleLogin = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadLoginStatic],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewUser = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadCreateSponsoredAccount(), ExamplePayloadPublicGraphKey(), ExamplePayloadClaimHandle()],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewProvider = async (): Promise<SiwfResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadGrantDelegation()],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});
