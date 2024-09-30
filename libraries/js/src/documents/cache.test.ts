import { describe, it, vi, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { getCached, setCached } from './cache.js';

const ExampleDidOne = {
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
  id: 'did:web:frequencyaccess.com',
  assertionMethod: [
    {
      id: 'did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD',
      type: 'Multikey',
      controller: 'did:web:frequencyaccess.com',
      publicKeyMultibase: 'z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD',
    },
  ],
};

const ExampleDidTwo = {
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
  id: 'did:web:frequencyaccess.com',
  assertionMethod: [
    {
      id: 'did:web:frequencyaccess.com#z6Mkp4EivHMs3Bs32XrpHvtQEvsY9v2QWq5sEfsMnxLjVCRm',
      type: 'Multikey',
      controller: 'did:web:frequencyaccess.com',
      publicKeyMultibase: 'z6Mkp4EivHMs3Bs32XrpHvtQEvsY9v2QWq5sEfsMnxLjVCRm',
    },
  ],
};

describe('Cache', () => {
  it('can append if requested', () => {
    setCached('did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD', ExampleDidOne, true);

    setCached('did:web:frequencyaccess.com#z6Mkp4EivHMs3Bs32XrpHvtQEvsY9v2QWq5sEfsMnxLjVCRm', ExampleDidTwo, true);

    const did = getCached('did:web:frequencyaccess.com');

    expect(did!.assertionMethod).toHaveLength(2);
  });
});

describe('Cache Expiration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('expires after 24 hours', () => {
    setCached('did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD', ExampleDidOne);

    vi.setSystemTime(new Date(Date.now() + 1 + 1000 * 60 * 60 * 24));

    const did = getCached('did:web:frequencyaccess.com');

    expect(did).toBeNull();
  });
});
