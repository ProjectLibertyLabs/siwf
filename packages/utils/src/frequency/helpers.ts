import { PresumptiveSuffixesResponse } from '@frequency-chain/api-augment/interfaces';
import { getApi } from './connect';
import { ApiPromise } from '@polkadot/api';
import type { AnyNumber, Codec } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';

export { Codec };
export interface MsaInfo {
  msaId: string;
  handle: string;
}

const Registry = new TypeRegistry();
Registry.register({
  ClaimHandle: {
    baseHandle: 'Bytes',
    expiration: 'u32',
  },
});

export async function createClaimHandlePayload(expiration: number, handle: string): Promise<Uint8Array> {
  const api = await getApi();
  const handleBytes = new Bytes(Registry, handle);
  return api.registry
    .createType('CommonPrimitivesHandlesClaimHandlePayload', {
      baseHandle: handleBytes,
      expiration,
    })
    .toU8a();
}

export async function createAddProviderPayload(
  expiration: number,
  providerId: string,
  schemaIds: number[]
): Promise<Uint8Array> {
  const api = await getApi();
  schemaIds.sort();
  return api.registry
    .createType('PalletMsaAddProvider', {
      authorizedMsaId: providerId,
      expiration,
      schemaIds,
    })
    .toU8a();
}

export async function getBlockNumber(): Promise<number> {
  const api = await getApi();
  return (await api.rpc.chain.getBlock()).block.header.number.toNumber();
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

export async function buildHandleTx(msaOwnerKey: string, proof: string, payload: Uint8Array): Promise<Codec> {
  const api = await getApi();
  return api.tx.handles.claimHandle(msaOwnerKey, proof, payload);
}

export async function buildCreateSponsoredAccountTx(
  controlKey: string,
  providerKey: string,
  signature: string,
  payload: Uint8Array
): Promise<Uint8Array> {
  const api = await getApi();
  return api.tx.msa.createSponsoredAccount(controlKey, providerKey, signature, payload).toU8a();
}
