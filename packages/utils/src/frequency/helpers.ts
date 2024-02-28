import { PresumptiveSuffixesResponse, SchemaVersionResponse } from '@frequency-chain/api-augment/interfaces';
import { getApi } from './connect';
import { ApiPromise } from '@polkadot/api';
import type { AnyNumber, Codec, ISubmittableResult } from '@polkadot/types/types';
import { Bytes, u16 } from '@polkadot/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { CommonPrimitivesMsaProviderRegistryEntry } from '@polkadot/types/lookup';
import { RequestedSchema } from '../wallet-proxy/messenger';

export { Codec };
export interface MsaInfo {
  msaId: string;
  handle: string;
}

export async function createClaimHandlePayload(expiration: number, handle: string): Promise<Uint8Array> {
  const api = await getApi();
  const handleBytes = new Bytes(api.registry, handle);
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

export async function getMsaInfo(address: string[], apiPromise?: ApiPromise): Promise<MsaInfo[]> {
  const api = apiPromise || (await getApi());
  const msaIds = await getMsaIds(address, api);
  const handles = await getHandles(msaIds, api);
  return msaIds.map((msaId, i) => ({
    msaId: msaId.toString(),
    handle: handles[i],
  }));
}

export async function getMsaIds(addresses: string[], apiPromise?: ApiPromise): Promise<string[]> {
  const api = apiPromise || (await getApi());
  return (await api.query.msa.publicKeyToMsaId.multi(addresses)).map((result) => result.unwrapOrDefault().toString());
}

export async function getHandles(msaIds: AnyNumber[], apiPromise?: ApiPromise): Promise<string[]> {
  const api = apiPromise || (await getApi());
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

export async function buildHandleTx(
  msaOwnerKey: string,
  proof: { Sr25519: string },
  payload: Uint8Array
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
  const api = await getApi();
  return api.tx.handles.claimHandle(msaOwnerKey, proof, payload);
}

export async function buildCreateSponsoredAccountTx(
  controlKey: string,
  proof: { Sr25519: string },
  payload: Uint8Array
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
  const api = await getApi();
  return api.tx.msa.createSponsoredAccountWithDelegation(controlKey, proof, payload);
}

export async function getProviderRegistryInfo(providerId: AnyNumber) {
  const api = await getApi();
  const providerInfo: CommonPrimitivesMsaProviderRegistryEntry = (
    await api.query.msa.providerToRegistryEntry(providerId)
  ).unwrapOrDefault();

  return providerInfo.providerName.toUtf8();
}

export async function resolveSchemas(schemas: RequestedSchema[]): Promise<void> {
  const api = await getApi();
  const response = await api.query.schemas.schemaNameToIds.multi(schemas.map((s) => ['dsnp', s.name]));

  schemas.forEach((schema, index) => {
    const ids = response[index].ids
      .toArray()
      .map((id) => (id as u16).toNumber())
      .sort();
    if (schema?.version && schema.version > 0) {
      if (schema.version > ids.length) {
        throw new Error(`Unable to find version ${schema.version} of schema ${schema.name}`);
      }

      schema.id = ids[schema.version - 1];
    } else {
      ids.reverse();
      schema.id = ids[0];
    }
  });
}
