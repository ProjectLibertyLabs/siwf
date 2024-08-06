import { ExtensionConnector } from '@projectlibertylabs/siwf-utils';
import {
  createAddProviderPayload,
  createClaimHandlePayload,
  getBlockNumber,
  getHandleNextSuffixes,
} from '@projectlibertylabs/siwf-utils';
import { APP_NAME } from '$lib/globals';
import type { U8aLike } from '@polkadot/util/types';
import { Message, type WalletProxyResponse, WindowEndpoint } from '@projectlibertylabs/siwf';

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

export async function getDelegationPayload(
  providerId: string,
  schemaIds: number[]
): Promise<{ raw: { authorizedMsaId: string; expiration: number; schemaIds: number[] }; bytes: Uint8Array }> {
  const blockNumber = await getBlockNumber();
  const expiration = blockNumber + 50;
  const bytes = await createAddProviderPayload(expiration, providerId, schemaIds);

  return {
    raw: { authorizedMsaId: providerId, expiration, schemaIds },
    bytes,
  };
}

let windowEndpoint: WindowEndpoint | undefined;

export const getWindowEndpoint = async () => {
  return windowEndpoint ?? (windowEndpoint = await WindowEndpoint.create());
};

export const sendWalletProxyResponse = async (message: WalletProxyResponse) => {
  const endpoint = await getWindowEndpoint();
  endpoint.sendEvent(Message.WalletProxyResponseMessage, message);
};

export * from './DSNPSchemas';
