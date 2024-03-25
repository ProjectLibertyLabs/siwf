import { storable } from './storable';

export type MsaAndAddress = {
  msaId: string;
  address: string;
};

export const CachedLastUsedMsaAndAddressStore = storable<MsaAndAddress>('LastUsedMsaAndAddress');
