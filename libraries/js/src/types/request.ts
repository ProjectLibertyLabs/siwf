import { isArrayOf, isHexStr, isNum, isObj, isPublicKey, isStr, SiwfPublicKey } from './general.js';

interface AnyOfRequired {
  anyOf: SiwfCredential[];
}

export interface SiwfCredential {
  type: string;
  hash: string[];
}

// Union of the different interfaces
export type SiwfCredentialRequest = AnyOfRequired | SiwfCredential;

export interface SiwfSignedRequest {
  requestedSignatures: {
    publicKey: SiwfPublicKey;
    signature: {
      algo: 'SR25519';
      encoding: 'base16';
      encodedValue: string;
    };
    payload: {
      callback: string;
      permissions: number[];
      userIdentifierAdminUrl?: string;
    };
  };
  requestedCredentials?: SiwfCredentialRequest[];
  applicationContext?: { url: string };
}

function isSiwfCredential(input: unknown): input is SiwfCredential {
  return isObj(input) && isStr(input.type) && isArrayOf(input.hash, isStr);
}

function isAnyOf(input: unknown): input is AnyOfRequired {
  return isObj(input) && 'anyOf' in input && (input.anyOf || []).every(isSiwfCredential);
}

function isSiwfCredentialRequest(input: unknown): input is SiwfCredentialRequest {
  if (isSiwfCredential(input)) return true;
  return isAnyOf(input);
}

export function isSiwfCredentialsRequest(input: unknown): input is SiwfCredentialRequest[] {
  if (Array.isArray(input)) {
    return input.every(isSiwfCredentialRequest);
  }
  return false;
}

function isRequestedSignaturePayload(input: unknown): input is SiwfSignedRequest['requestedSignatures']['payload'] {
  return isObj(input) && isStr(input.callback) && isArrayOf(input.permissions, isNum);
}

function isRequestedSignature(input: unknown): input is SiwfSignedRequest['requestedSignatures'] {
  return (
    isObj(input) &&
    input.algo?.toUpperCase() === 'SR25519' &&
    input.encoding === 'base16' &&
    isHexStr(input.encodedValue)
  );
}

function isRequestedSignatures(input: unknown): input is SiwfSignedRequest['requestedSignatures'] {
  return (
    isObj(input) &&
    isPublicKey(input.publicKey) &&
    isRequestedSignature(input.signature) &&
    isRequestedSignaturePayload(input.payload)
  );
}

export function isSiwfSignedRequest(input: unknown): input is SiwfSignedRequest {
  return (
    isObj(input) &&
    isRequestedSignatures(input.requestedSignatures) &&
    isSiwfCredentialsRequest(input.requestedCredentials)
  );
}
