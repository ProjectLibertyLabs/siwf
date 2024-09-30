import { verifyCredential } from '@digitalcredentials/vc';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from './vc/cryptosuite-eddsa/index.js';
import { DataIntegrityProof } from './vc/data-integrity/index.js';
import { SiwaResponse } from './types/response.js';
import {
  isCredentialEmail,
  isCredentialGraph,
  isCredentialPhone,
  SiwaResponseCredential,
  SiwaResponseCredentialGraph,
} from './types/credential.js';
import { isValidX25519PrivateKey } from './x25519.js';
import { documentLoaderGenerator } from './documents/loader.js';

async function validateGraph(credential: SiwaResponseCredentialGraph): Promise<void> {
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

export async function validateGeneralCredential(
  credential: SiwaResponseCredential,
  trustedIssuers: string[]
): Promise<void> {
  // Make sure we can validate
  // I don't think we need this? Likely happens inside vc.verifyCredential
  if (
    credential.proof.proofPurpose !== 'assertionMethod' ||
    !['eddsa-rdfc-2022'].includes(credential.proof.cryptosuite)
  ) {
    throw new Error(`Unknown Credential Proof Verification: ${JSON.stringify(credential.proof)}`);
  }

  // Check credential expiration/validity
  if (credential.proof.validUntil && Date.parse(credential.proof.validUntil) < Date.now()) {
    throw new Error(`Credential Expired: ${credential.proof.validUntil}`);
  }

  if (credential.proof.expirationDate && Date.parse(credential.proof.expirationDate) < Date.now()) {
    throw new Error(`Credential Expired: ${credential.proof.expirationDate}`);
  }

  const suite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022CryptoSuite });

  const vcTest = await verifyCredential({
    credential,
    suite,
    documentLoader: documentLoaderGenerator(trustedIssuers),
  });

  if (!vcTest.verified) {
    throw new Error(
      `Unable to validate credential (${credential.type.join(', ')}). ${vcTest.error.name}:${vcTest.error?.errors?.join(', ') || 'Unknown'}`
    );
  }
}

export async function validateCredential(credential: SiwaResponseCredential, trustedIssuers: string[]): Promise<void> {
  switch (true) {
    case isCredentialEmail(credential):
      await validateGeneralCredential(credential, trustedIssuers);
      break;
    case isCredentialPhone(credential):
      await validateGeneralCredential(credential, trustedIssuers);
      break;
    case isCredentialGraph(credential):
      await validateGraph(credential);
      break;
  }
}

export async function validateCredentials(
  credentials: SiwaResponse['credentials'],
  trustedIssuers: string[] = []
): Promise<void> {
  // Only validate if there are any
  if (!credentials) return;

  for (const credential of credentials) {
    // Throws on error
    await validateCredential(credential, trustedIssuers);
  }
}
