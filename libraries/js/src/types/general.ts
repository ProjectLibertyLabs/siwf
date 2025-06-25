import { validateAddress } from '@polkadot/util-crypto/address/validate';
import { SupportedPayload } from '@frequency-chain/ethereum-utils';

export interface SiwfOptions {
  endpoint: string;
  loginMsgUri?: string | string[];
}

export type CurveType = 'Sr25519' | 'Secp256k1';

export type AlgorithmType = 'SR25519' | 'SECP256K1';

export type SignedPayload = Uint8Array | SupportedPayload;

export type EncodingType = 'base58' | 'base16';

export type FormatType = 'ss58' | 'eip-55';

export interface SiwfPublicKey {
  encodedValue: string;
  encoding: EncodingType;
  format: FormatType;
  type: CurveType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPublicKey(obj: any): obj is SiwfPublicKey {
  return (
    isObj(obj) &&
    ((validateAddress(obj.encodedValue) &&
      obj.encoding === 'base58' &&
      obj.format === 'ss58' &&
      obj.type?.toUpperCase() === 'SR25519') ||
      (isEthereumAddress(obj.encodedValue) &&
        obj.encoding === 'base16' &&
        obj.format === 'eip-55' &&
        obj.type?.toUpperCase() === 'SECP256K1'))
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isStr(obj: any): obj is string {
  return typeof obj === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHexStr(obj: any): obj is string {
  return isStr(obj) && obj.toLowerCase().startsWith('0x');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNum(obj: any): obj is number {
  return typeof obj === 'number';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObj(obj: any): obj is Record<string, any> {
  return typeof obj === 'object' && obj !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArrayOf<T>(obj: any, checkFn: (x: T) => x is T): obj is T[] {
  return Array.isArray(obj) && obj.every(checkFn);
}

export function isSignedPayloadUint8Array(value: SignedPayload): value is Uint8Array {
  return value instanceof Uint8Array;
}

export function isSignedPayloadSupportedPayload(value: SignedPayload): value is SupportedPayload {
  return !(value instanceof Uint8Array);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEthereumAddress(obj: any): boolean {
  return isHexStr(obj) && obj.length === 42;
}
