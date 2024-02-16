import { ExtensionConnector } from '@frequency-control-panel/utils';
import { createClaimHandlePayload, getBlockNumber, getHandleNextSuffixes } from '@frequency-control-panel/utils';
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

export async function getHandlePayloadSignature(
  extensionName: string,
  account: string,
  handleName: string
): Promise<{ signature: U8aLike; payload: Record<string, unknown> }> {
  const blockNumber = await getBlockNumber();
  const expiration = blockNumber + 50;
  const handlePayload = await createClaimHandlePayload(expiration, handleName);

  try {
    const connector = new ExtensionConnector(window.injectedWeb3, APP_NAME);
    await connector.connect(extensionName);

    const signature = await connector.signMessageWithWrappedBytes(handlePayload, account);
    return { signature, payload: { raw: { baseHandle: handleName, expiration }, bytes: handlePayload } };
  } catch (error) {
    console.error('Error while signing message', error);
    throw error;
  }
}
