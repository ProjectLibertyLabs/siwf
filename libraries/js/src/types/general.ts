import { validateAddress } from '@polkadot/util-crypto/address/validate';

export interface SiwaOptions {
  endpoint: string;
}

export interface SiwaPublicKey {
  encodedValue: string;
  encoding: 'base58';
  format: 'ss58';
  type: 'Sr25519';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPublicKey(obj: any): obj is SiwaPublicKey {
  return (
    isObj(obj) &&
    validateAddress(obj.encodedValue) &&
    obj.encoding === 'base58' &&
    obj.format === 'ss58' &&
    obj.type === 'Sr25519'
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
