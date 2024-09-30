import { credentials, dataIntegrity, multikey, undefinedTerms } from './static.js';
import { isObj } from '../types/general.js';
import { getCached, setCached } from './cache.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DidDoc = Record<string, any>;

const documents = new Map<string, DidDoc>();

documents.set(dataIntegrity.id, dataIntegrity.doc);
documents.set(credentials.id, credentials.doc);
documents.set(undefinedTerms.id, undefinedTerms.doc);
documents.set(multikey.id, multikey.doc);

// This builds a did:key version of the document
function keyToDidDocument(url: string, key: string) {
  const rootUrl = url.split('#')[0];
  return {
    '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
    id: rootUrl,
    assertionMethod: [
      {
        '@context': ['https://w3id.org/security/multikey/v1'],
        id: url,
        type: 'Multikey',
        controller: rootUrl,
        publicKeyMultibase: key,
      },
    ],
  };
}

async function didWeb(url: string, trustedIssuers: string[]): Promise<DidDoc> {
  const [did, key] = url.split('#');
  if (!did || !key) {
    console.trace('Missing DID key');
    throw new Error(`Missing DID Key: ${url}`);
  }

  // Trusted Issuer?
  if (trustedIssuers.includes(did)) {
    const trustedDidDoc = keyToDidDocument(url, key);
    setCached(url, trustedDidDoc, true);
    return trustedDidDoc;
  }

  const withoutWeb = did.replace(/^did:web:/, '').replace(':', '/');
  const fetchUrl = new URL('https://' + withoutWeb);
  if (fetchUrl.pathname === '/') {
    fetchUrl.pathname = '/.well-known/did.json';
  }
  const docResponse = await fetch(fetchUrl);

  if (!docResponse.ok) {
    throw new Error(`Unable to resolve DID: ${url} with ${fetchUrl.toString()}`);
  }
  const didDoc = await docResponse.json();

  if (!isObj(didDoc)) {
    throw new Error(`Invalid response from ${fetchUrl.toString()}`);
  }
  if (didDoc.id !== did) {
    throw new Error(`Issuer (${url}) and Response Id (${didDoc.id}) mismatched!`);
  }
  return didDoc;
}

// This is a simplified method that would only work due to assumptions in Frequency Access, but it works for the limited use case of this library which is Frequency Access
// NOTICE: It does NOT support the `trust` extensions
async function getDid(url: string, trustedIssuers: string[]): Promise<DidDoc | null> {
  // Handle the cache case
  const cachedValue = getCached(url);
  if (cachedValue) {
    return cachedValue;
  }

  if (url.startsWith('did:web:')) {
    const webDid = await didWeb(url, trustedIssuers);
    if (webDid) {
      return webDid;
    }
  }

  // This assumes the key is a base58-btc multikey
  if (url.startsWith('did:key:z')) {
    const key = url.replace(/^did:key:/, '');
    const keyGeneratedDidDoc = keyToDidDocument(url, key);
    return keyGeneratedDidDoc;
  }
  return null;
}

export function documentLoaderGenerator(trustedDids: string[] = []) {
  return async function (url: string): Promise<{ document: DidDoc }> {
    const savedDocument = documents.get(url);
    if (savedDocument) {
      return { document: savedDocument };
    }
    const gotDid = await getDid(url, trustedDids);
    if (gotDid) {
      setCached(url, gotDid);
      if (!url.includes('#')) {
        return { document: gotDid };
      }
      //Ok. Got a hash, so need to get the right assertionMethod
      const matchKey = url.split('#')[1] || '';
      const foundAssertion = (gotDid.assertionMethod || []).find((x: { id?: string }) => x?.id?.includes(matchKey));
      if (foundAssertion) {
        return { document: foundAssertion };
      }

      throw new Error(`Unable to find matching key in assertionMethod for: ${url}`);
    }
    throw new Error(`Unable to resolve DID: ${url}`);
  };
}
