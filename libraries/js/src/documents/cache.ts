import { DidDoc } from './loader.js';

let cachedValidDids = new Map<string, DidDoc>();
let cacheDate = Date.now();
// Expire the entire cache after 24 hours
// This will create a fencepost bug for trusted issuers :(
const CACHE_EXPIRES_MS = 1000 * 60 * 60 * 24;

function expireCache() {
  if (cacheDate + CACHE_EXPIRES_MS < Date.now()) {
    cacheDate = Date.now();
    cachedValidDids = new Map();
  }
}

// Takes the two arrays and appends the new assertionMethods to mutateDoc from fromDoc
function appendAssertionMethodIfNeeded(mutateDoc: DidDoc, fromDoc: DidDoc) {
  const existingIds = new Set((mutateDoc?.assertionMethod || []).map((x: { id: string }) => x.id));
  const appendAssertionMethods = (fromDoc?.assertionMethod || []).filter((x: { id: string }) => !existingIds.has(x));
  mutateDoc.assertionMethod = (mutateDoc.assertionMethod || []).concat(appendAssertionMethods);
}

export function setCached(url: string, document: DidDoc, appendKeys = false) {
  expireCache();
  const cacheKey = url.split('#')[0];
  if (!cacheKey) return;
  if (appendKeys) {
    const existing = cachedValidDids.get(cacheKey);
    if (existing) {
      appendAssertionMethodIfNeeded(document, existing);
    }
  }
  cachedValidDids.set(cacheKey, document);
}

export function getCached(url: string): DidDoc | null {
  expireCache();
  const cacheKey = url.split('#')[0];
  if (!cacheKey) return null;

  const value = cachedValidDids.get(cacheKey);
  return value || null;
}
