import { describe, expect, it } from 'vitest';
import { isValidX25519PrivateKey } from './x25519.js';

describe('z25519 validation', () => {
  it('isValidX25519PrivateKey successful case', () => {
    expect(
      isValidX25519PrivateKey(
        '0xf03c447ad2f6d6899c1d89b8122a2da8f05ee4829e7f4b329138a0bf9a884a67',
        '0xeea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37'
      )
    ).toBe(true);
  });
  it('isValidX25519PrivateKey error case', () => {
    expect(isValidX25519PrivateKey('', '')).toBe(false);
  });
});
