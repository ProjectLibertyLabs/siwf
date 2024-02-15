import { PresumptiveSuffixesResponse } from '@frequency-chain/api-augment/interfaces';
import { getApi } from './connect';
import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';

export interface MsaInfo {
  msaId: string;
  handle: string;
}

export async function getMsaInfo(address: string[]): Promise<MsaInfo[]> {
  const api = await getApi();
  const msaIds = await getMsaIds(api, address);
  const handles = await getHandles(api, msaIds);
  return msaIds.map((msaId, i) => ({
    msaId: msaId.toString(),
    handle: handles[i],
  }));
}

async function getMsaIds(api: ApiPromise, address: string[]): Promise<string[]> {
  return (await api.query.msa.publicKeyToMsaId.multi(address)).map((result) => result.unwrapOrDefault().toString());
}

async function getHandles(api: ApiPromise, msaIds: AnyNumber[]): Promise<string[]> {
  return (await api.query.handles.msaIdToDisplayName.multi(msaIds)).map((r) => r.unwrapOrDefault()[0].toUtf8());
}

export async function validateHandle(handle: string): Promise<boolean> {
  const api = await getApi();
  return (await api.rpc.handles.validateHandle(handle)).toHuman();
}

export async function getHandleNextSuffixes(handle: string, count: number): Promise<PresumptiveSuffixesResponse> {
  const api = await getApi();
  return await api.rpc.handles.getNextSuffixes(handle, count);
}
