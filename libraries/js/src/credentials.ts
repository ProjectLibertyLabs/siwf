import { verifyCredential } from '@digitalcredentials/vc';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from './vc/cryptosuite-eddsa/index.js';
import { DataIntegrityProof } from './vc/data-integrity/index.js';
import { SiwfResponse } from './types/response.js';
import {
  isCredentialEmail,
  isCredentialGraph,
  isCredentialPhone,
  isCredentialRecoverySecret,
  SiwfResponseCredential,
  SiwfResponseCredentialGraph,
  SiwfResponseCredentialRecoverySecret,
} from './types/credential.js';
import { isValidX25519PrivateKey } from './x25519.js';
import { documentLoaderGenerator } from './documents/loader.js';

const RecoverySecretPattern = /^([0-9A-F]{4}-){15}[0-9A-F]{4}$/;

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

async function validateRecoverySecret(credential: SiwfResponseCredentialRecoverySecret): Promise<void> {
  // Make sure that recovery secret format is good
  if (!RecoverySecretPattern.test(credential.credentialSubject.recoverySecret)) {
    throw new Error(`SiwfResponseCredentialRecoverySecret: Invalid recoverySecret`);
  }
}

export async function validateGeneralCredential(
  credential: SiwfResponseCredential,
  trustedIssuers: string[]
): Promise<void> {
  // Make sure we can validate
  if (credential.proof == undefined) {
    throw new Error(`Proof is not provided!`);
  }
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

  // Check credential issuance date
  if (credential.validFrom && Date.parse(credential.validFrom) > Date.now()) {
    throw new Error(`Credential Not Yet Valid: ${credential.validFrom}`);
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

export async function validateCredential(credential: SiwfResponseCredential, trustedIssuers: string[]): Promise<void> {
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
    case isCredentialRecoverySecret(credential):
      await validateRecoverySecret(credential);
      break;
  }
}

export async function validateCredentials(
  credentials: SiwfResponse['credentials'],
  trustedIssuers: string[] = []
): Promise<void> {
  // Only validate if there are any
  if (!credentials) return;

  for (const credential of credentials) {
    // Throws on error
    await validateCredential(credential, trustedIssuers);
  }
}
