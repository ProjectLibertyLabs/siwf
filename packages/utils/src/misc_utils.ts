/**
 * Convenience method for an async delay; to avoid having
 * to type it long-hand each time.
 *
 * @param {number} ms - Number of milliseconds to delay
 * @returns {Promise<void>} - A Promise that resolves when the timeout has fired
 */
export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatWalletAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function parseHandle(handle: string): { base: string; suffix: number } {
  const result = /^(.*)\.(\d*)$/.exec(handle);
  const base = result?.[1] ?? '';
  const suffix = Number(result?.[2] ?? 0);
  return { base, suffix };
}

export function getHandleBase(handle: string): string {
  const { base } = parseHandle(handle);
  return base;
}

export function getHandleSuffix(handle: string): number {
  const { suffix } = parseHandle(handle);
  return suffix;
}
