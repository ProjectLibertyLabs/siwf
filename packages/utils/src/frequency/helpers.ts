import { PresumptiveSuffixesResponse } from '@frequency-chain/api-augment/interfaces';
import { getApi } from './connect';
import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';

export interface MsaInfo {
  msaId: string;
  handle: string;
}

export async function getMsaInfo(address: string | string[]): Promise<MsaInfo | MsaInfo[]> {
  const api = await getApi();
  const msaIds = await getMsaIds(api, address);
  const handles = await getHandles(api, msaIds);
  if (Array.isArray(msaIds)) {
    return msaIds.map((msaId, i) => ({
      msaId: msaId.toString(),
      handle: handles[i],
    }));
  } else {
    return { msaId: msaIds.toString(), handle: handles as string };
  }
}

async function getMsaIds(api: ApiPromise, address: string | string[]): Promise<string | string[]> {
  let msaIds: string | string[];

  if (Array.isArray(address)) {
    msaIds = (await api.query.msa.publicKeyToMsaId.multi(address)).map((result) => result.unwrapOrDefault().toString());
  } else {
    msaIds = (await api.query.msa.publicKeyToMsaId(address as string)).unwrapOrDefault().toString();
  }
  return msaIds;
}

async function getHandles(api: ApiPromise, msaIds: AnyNumber | AnyNumber[]): Promise<string | string[]> {
  let handles: string | string[];
  if (Array.isArray(msaIds)) {
    handles = (await api.query.handles.msaIdToDisplayName.multi(msaIds)).map((r) => r.unwrapOrDefault()[0].toUtf8());
  } else {
    handles = (await api.query.handles.msaIdToDisplayName(msaIds)).unwrapOrDefault()[0].toUtf8();
  }
  return handles;
}

export async function validateHandle(handle: string): Promise<boolean> {
  const api = await getApi();
  return (await api.rpc.handles.validateHandle(handle)).toHuman();
}

export async function getHandleNextSuffixes(handle: string, count: number): Promise<PresumptiveSuffixesResponse> {
  const api = await getApi();
  return await api.rpc.handles.getNextSuffixes(handle, count);
}
