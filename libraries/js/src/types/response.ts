import { isObj, SiwaPublicKey, isPublicKey } from './general.js';
import { isCredentials, SiwaResponseCredential } from './credential.js';
import { isPayloads, SiwaResponsePayload } from './payload.js';

export interface SiwaResponse {
  userPublicKey: SiwaPublicKey;
  payloads: SiwaResponsePayload[];
  credentials?: SiwaResponseCredential[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSiwaResponse(obj: any): obj is SiwaResponse {
  return (
    isObj(obj) &&
    isPublicKey(obj.userPublicKey) &&
    isPayloads(obj.payloads) &&
    // Optional
    isCredentials(obj.credentials || [])
  );
}
