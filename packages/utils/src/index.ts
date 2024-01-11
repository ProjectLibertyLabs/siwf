export * from './wallet';

/**
 * Convenience method for an async delay; to avoid having
 * to type it long-hand each time.
 *
 * @param {number} ms - Number of milliseconds to delay
 * @returns {∏romise<void>} - A Promise that resolves when the timeout has fired
 */
export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
