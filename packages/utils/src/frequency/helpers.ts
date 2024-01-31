import { PresumptiveSuffixesResponse } from '@frequency-chain/api-augment/interfaces';
import { getApi } from './connect';
import { ApiPromise } from '@polkadot/api';

export interface MsaInfo {
  msaId: number;
  handle: string;
}

export async function getMsaInfo(address: string): Promise<MsaInfo> {
  const api = await getApi();
  const msaId = await getMsaId(api, address);
  const handle = await getHandle(api, msaId);
  return { msaId, handle };
}

async function getMsaId(api: ApiPromise, address: string): Promise<number> {
  const msaId = (await api.query.msa.publicKeyToMsaId(address)).unwrapOrDefault().toNumber();
  return msaId === 0 ? 0 : msaId;
}

async function getHandle(api: ApiPromise, msaId: number): Promise<string> {
  const handleResult = (await api.query.handles.msaIdToDisplayName(msaId)).unwrapOrDefault();
  const handle = handleResult[0].toUtf8();
  return handle;
}

export async function validateHandle(handle: string): Promise<boolean> {
  const api = await getApi();
  return (await api.rpc.handles.validateHandle(handle)).toHuman();
}

export async function getHandleNextSuffixes(handle: string, count: number): Promise<PresumptiveSuffixesResponse> {
  const api = await getApi();
  return await api.rpc.handles.getNextSuffixes(handle, count);
}
