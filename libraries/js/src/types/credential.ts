import { VerifiedEmailAddress, VerifiedGraphKey, VerifiedPhoneNumber } from '../constants.js';
import { isArrayOf, isObj, isStr } from './general.js';

interface SiwfResponseCredentialBase {
  '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/undefined-terms/v2'];
  type: string[];
  issuer: string;
  validFrom?: string;
  credentialSchema: {
    type: 'JsonSchema';
    id: string;
  };
  credentialSubject: Record<string, unknown>;
  proof?: {
    type: 'DataIntegrityProof';
    created?: string;
    verificationMethod: string;
    cryptosuite: 'eddsa-rdfc-2022';
    proofPurpose: 'assertionMethod';
    proofValue: string;
    expirationDate?: string;
    validUntil?: string;
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCredentialSchema(obj: any): obj is SiwfResponseCredentialBase['credentialSchema'] {
  return isObj(obj) && obj.type === 'JsonSchema' && typeof obj.id === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCredentialSubject(obj: any): obj is SiwfResponseCredentialBase['credentialSubject'] {
  return isObj(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCredentialProof(obj: any): obj is SiwfResponseCredentialBase['proof'] {
  return (
    isObj(obj) &&
    obj.type === 'DataIntegrityProof' &&
    obj.cryptosuite === 'eddsa-rdfc-2022' &&
    obj.proofPurpose === 'assertionMethod' &&
    isStr(obj.verificationMethod) &&
    isStr(obj.proofValue)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCredentialBase(obj: any): obj is SiwfResponseCredentialBase {
  return (
    isObj(obj) &&
    (isStr(obj['@context']) || isArrayOf(obj['@context'], isStr)) &&
    isArrayOf(obj.type, isStr) &&
    isStr(obj.issuer) &&
    isCredentialSchema(obj.credentialSchema) &&
    isCredentialSubject(obj.credentialSubject)
  );
}

export interface SiwfResponseCredentialEmail extends SiwfResponseCredentialBase {
  type: ['VerifiedEmailAddressCredential', 'VerifiableCredential'];
  credentialSubject: {
    id: string;
    emailAddress: string;
    lastVerified: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCredentialEmail(obj: any): obj is SiwfResponseCredentialEmail {
  return (
    isCredentialBase(obj) &&
    isCredentialProof(obj.proof) &&
    obj.type.includes(VerifiedEmailAddress.credential.type) &&
    obj.credentialSchema.id === VerifiedEmailAddress.id &&
    isStr(obj.credentialSubject.id) &&
    isStr(obj.credentialSubject.emailAddress) &&
    isStr(obj.credentialSubject.lastVerified)
  );
}

export interface SiwfResponseCredentialPhone extends SiwfResponseCredentialBase {
  type: ['VerifiedPhoneNumberCredential', 'VerifiableCredential'];
  credentialSubject: {
    id: string;
    phoneNumber: string;
    lastVerified: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCredentialPhone(obj: any): obj is SiwfResponseCredentialPhone {
  return (
    isCredentialBase(obj) &&
    isCredentialProof(obj.proof) &&
    obj.type.includes(VerifiedPhoneNumber.credential.type) &&
    obj.credentialSchema.id === VerifiedPhoneNumber.id &&
    isStr(obj.credentialSubject.id) &&
    isStr(obj.credentialSubject.phoneNumber) &&
    isStr(obj.credentialSubject.lastVerified)
  );
}

export interface SiwfResponseCredentialGraph extends SiwfResponseCredentialBase {
  type: ['VerifiedGraphKeyCredential', 'VerifiableCredential'];
  credentialSubject: {
    id: string;
    encodedPublicKeyValue: string;
    encodedPrivateKeyValue: string;
    encoding: 'base16';
    format: 'bare';
    type: 'X25519';
    keyType: 'dsnp.public-key-key-agreement';
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCredentialGraph(obj: any): obj is SiwfResponseCredentialGraph {
  return (
    isCredentialBase(obj) &&
    obj.type.includes(VerifiedGraphKey.credential.type) &&
    obj.credentialSchema.id === VerifiedGraphKey.id &&
    isStr(obj.credentialSubject.id) &&
    isStr(obj.credentialSubject.encodedPublicKeyValue) &&
    isStr(obj.credentialSubject.encodedPrivateKeyValue) &&
    obj.credentialSubject.encoding === 'base16' &&
    obj.credentialSubject.format === 'bare' &&
    obj.credentialSubject.type === 'X25519' &&
    obj.credentialSubject.keyType === 'dsnp.public-key-key-agreement'
  );
}

export type SiwfResponseCredential =
  | SiwfResponseCredentialEmail
  | SiwfResponseCredentialPhone
  | SiwfResponseCredentialGraph;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCredential(obj: any): obj is SiwfResponseCredential {
  return isCredentialEmail(obj) || isCredentialPhone(obj) || isCredentialGraph(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCredentials(obj: any): obj is SiwfResponseCredential[] {
  return isArrayOf(obj, isCredential);
}
