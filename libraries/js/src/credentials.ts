import { SiwfResponse } from './types/response.js';
import {
  isCredentialEmail,
  isCredentialGraph,
  isCredentialPhone,
  SiwfResponseCredential,
  SiwfResponseCredentialGraph,
} from './types/credential.js';
import { isValidX25519PrivateKey } from './x25519.js';

async function validateGraph(credential: SiwfResponseCredentialGraph): Promise<void> {
  // Make sure that the key is good.
  if (
    !isValidX25519PrivateKey(
      credential.credentialSubject.encodedPrivateKeyValue,
      credential.credentialSubject.encodedPublicKeyValue
    )
  ) {
    throw new Error(`VerifiedGraphKeyCredential: Invalid KeyPair`);
  }
}

export async function validateGeneralCredential(credential: SiwfResponseCredential): Promise<void> {
  // Make sure we can validate
  // Check credential issuance date
  if (credential.validFrom && Date.parse(credential.validFrom) > Date.now()) {
    throw new Error(`Credential Not Yet Valid: ${credential.validFrom}`);
  }
}

export async function validateCredential(credential: SiwfResponseCredential): Promise<void> {
  switch (true) {
    case isCredentialEmail(credential):
      await validateGeneralCredential(credential);
      break;
    case isCredentialPhone(credential):
      await validateGeneralCredential(credential);
      break;
    case isCredentialGraph(credential):
      await validateGraph(credential);
      break;
  }
}

export async function validateCredentials(credentials: SiwfResponse['credentials']): Promise<void> {
  // Only validate if there are any
  if (!credentials) return;

  for (const credential of credentials) {
    // Throws on error
    await validateCredential(credential);
  }
}
