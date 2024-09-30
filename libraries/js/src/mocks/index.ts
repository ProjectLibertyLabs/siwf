import { SiwaResponse } from '../types/response.js';
import {
  ExamplePayloadClaimHandle,
  ExamplePayloadCreateSponsoredAccount,
  ExamplePayloadGrantDelegation,
  ExamplePayloadLoginStatic,
  ExamplePayloadPublicGraphKey,
} from './payloads.js';
import { ExampleEmailCredential, ExampleUserGraphCredential } from './credentials.js';
import { ExampleProviderKey, ExampleUserKey, multibaseEd25519 } from './keys.js';
import { SiwaPublicKey } from '../types/general.js';

export const ExampleUserPublicKey: SiwaPublicKey = {
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

export const ExampleLogin = async (): Promise<SiwaResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadLoginStatic],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewUser = async (): Promise<SiwaResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadCreateSponsoredAccount(), ExamplePayloadPublicGraphKey(), ExamplePayloadClaimHandle()],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});

export const ExampleNewProvider = async (): Promise<SiwaResponse> => ({
  userPublicKey: ExampleUserPublicKey,
  payloads: [ExamplePayloadGrantDelegation()],
  credentials: [await ExampleEmailCredential(), await ExampleUserGraphCredential()],
});
