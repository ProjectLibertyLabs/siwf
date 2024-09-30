import { isArrayOf, isHexStr, isNum, isObj, isPublicKey, isStr, SiwaPublicKey } from './general.js';

interface AnyOfRequired {
  anyOf: SiwaCredential[];
}

export interface SiwaCredential {
  type: string;
  hash: string[];
}

// Union of the different interfaces
export type SiwaCredentialRequest = AnyOfRequired | SiwaCredential;

export interface SiwaSignedRequest {
  requestedSignatures: {
    publicKey: SiwaPublicKey;
    signature: {
      algo: 'Sr25519';
      encoding: 'base16';
      encodedValue: string;
    };
    payload: {
      callback: string;
      permissions: number[];
    };
  };
  requestedCredentials?: SiwaCredentialRequest[];
}

function isSiwaCredential(input: unknown): input is SiwaCredential {
  return isObj(input) && isStr(input.type) && isArrayOf(input.hash, isStr);
}

function isAnyOf(input: unknown): input is AnyOfRequired {
  return isObj(input) && 'anyOf' in input && (input.anyOf || []).every(isSiwaCredential);
}

function isSiwaCredentialRequest(input: unknown): input is SiwaCredentialRequest {
  if (isSiwaCredential(input)) return true;
  return isAnyOf(input);
}

export function isSiwaCredentialsRequest(input: unknown): input is SiwaCredentialRequest[] {
  if (Array.isArray(input)) {
    return input.every(isSiwaCredentialRequest);
  }
  return false;
}

function isRequestedSignaturePayload(input: unknown): input is SiwaSignedRequest['requestedSignatures']['payload'] {
  return isObj(input) && isStr(input.callback) && isArrayOf(input.permissions, isNum);
}

function isRequestedSignature(input: unknown): input is SiwaSignedRequest['requestedSignatures'] {
  return isObj(input) && input.algo === 'Sr25519' && input.encoding === 'base16' && isHexStr(input.encodedValue);
}

function isRequestedSignatures(input: unknown): input is SiwaSignedRequest['requestedSignatures'] {
  return (
    isObj(input) &&
    isPublicKey(input.publicKey) &&
    isRequestedSignature(input.signature) &&
    isRequestedSignaturePayload(input.payload)
  );
}

export function isSiwaSignedRequest(input: unknown): input is SiwaSignedRequest {
  return (
    isObj(input) &&
    isRequestedSignatures(input.requestedSignatures) &&
    isSiwaCredentialsRequest(input.requestedCredentials)
  );
}
