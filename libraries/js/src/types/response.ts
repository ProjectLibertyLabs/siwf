import { isObj, SiwfPublicKey, isPublicKey } from './general.js';
import { isCredentials, SiwfResponseCredential } from './credential.js';
import { isPayloads, SiwfResponsePayload } from './payload.js';

export type MakePropertyRequired<T, K extends keyof T> = Partial<T> & Pick<Required<T>, K>;

export interface SiwfResponse {
  userPublicKey: SiwfPublicKey;
  payloads: SiwfResponsePayload[];
  credentials?: SiwfResponseCredential[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSiwfResponse(obj: any): obj is SiwfResponse {
  return (
    isObj(obj) &&
    isPublicKey(obj.userPublicKey) &&
    isPayloads(obj.payloads) &&
    // Optional
    isCredentials(obj.credentials || [])
  );
}
