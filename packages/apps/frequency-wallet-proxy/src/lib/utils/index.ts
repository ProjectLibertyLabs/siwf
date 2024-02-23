import { ExtensionConnector } from '@frequency-control-panel/utils';
import {
  createAddProviderPayload,
  createClaimHandlePayload,
  getBlockNumber,
  getHandleNextSuffixes,
} from '@frequency-control-panel/utils';
import { APP_NAME } from '$lib/globals';
import type { U8aLike } from '@polkadot/util/types';

export async function checkHandleAvailability(handle: string): Promise<boolean> {
  const minAvailableHandles = 5;
  const res = await getHandleNextSuffixes(handle, minAvailableHandles);
  return res.suffixes.length >= minAvailableHandles;
}

export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

export async function getHandlePayload(
  baseHandle: string
): Promise<{ raw: { baseHandle: string; expiration: number }; bytes: Uint8Array }> {
  const blockNumber = await getBlockNumber();
  const expiration = blockNumber + 50; // 60 seconds @ 12s block time

  const handlePayload = await createClaimHandlePayload(expiration, baseHandle);
  return {
    raw: {
      baseHandle,
      expiration,
    },
    bytes: handlePayload,
  };
}

export async function getPayloadSignature(
  extensionName: string,
  account: string,
  payload: Uint8Array
): Promise<U8aLike> {
  try {
    const connector = new ExtensionConnector(window.injectedWeb3, APP_NAME);
    await connector.connect(extensionName);

    const signature = await connector.signMessageWithWrappedBytes(payload, account);
    return signature;
  } catch (error) {
    console.error('Error while signing message', error);
    throw error;
  }
}

export async function getDelegationAndPermissionSignature(
  extensionName: string,
  account: string,
  providerId: string,
  schemasIds: number[]
): Promise<{
  signature: Uint8Array;
  payload: { raw: { authorizedMsaId: string; expiration: number; schemaIds: number[] }; bytes: U8aLike };
}> {
  const blockNumber = await getBlockNumber();
  const expiration = blockNumber + 50;
  const addProviderPayload = await createAddProviderPayload(expiration, providerId, schemasIds);

  try {
    const connector = new ExtensionConnector(window.injectedWeb3, APP_NAME);
    await connector.connect(extensionName);

    const signature = connector.signMessageWithWrappedBytes(addProviderPayload, account);
    return {
      signature,
      payload: { raw: { authorizedMsaId: providerId, expiration, schemaIds: schemasIds }, bytes: addProviderPayload },
    };
  } catch (error) {
    console.error('Error while signing message', error);
    throw error;
  }
}

export * from './DSNPSchemas';
