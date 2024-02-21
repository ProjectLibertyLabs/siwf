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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Date as any).prototype['toLocalISOString'] = function toIsoString() {
  const tzo = -this.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = function (num, places = 2) {
    return (num + '').padStart(places, '0');
  };

  return (
    this.getFullYear() +
    '-' +
    pad(this.getMonth() + 1) +
    '-' +
    pad(this.getDate()) +
    'T' +
    pad(this.getHours()) +
    ':' +
    pad(this.getMinutes()) +
    ':' +
    pad(this.getSeconds()) +
    '.' +
    pad(this.getMilliseconds(), 3) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};

export function objectToQueryString(obj) {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  });
  return keyValuePairs.join('&');
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
