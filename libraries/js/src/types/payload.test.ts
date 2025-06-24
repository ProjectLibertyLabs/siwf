import {
  ExamplePayloadCreateSponsoredAccountSr25519,
  ExamplePayloadGrantDelegationSr25519,
  ExamplePayloadLoginGood,
  ExamplePayloadPublicGraphKeySr25519,
} from '../mocks/payloads.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { isPayloadAddProvider, isPayloadItemActions, isPayloadLogin, isPayloads } from './payload.js';
import { cryptoWaitReady } from '@polkadot/util-crypto';

describe('Payload Types and Type Predicates', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  describe('isPayloads Single', () => {
    it('is successful with ExamplePayloadLoginGood', () => {
      expect(isPayloadLogin(ExamplePayloadLoginGood())).toBe(true);
      expect(isPayloads([ExamplePayloadLoginGood()])).toBe(true);
    });

    it('is successful with ExamplePayloadCreateSponsoredAccount', () => {
      expect(isPayloadAddProvider(ExamplePayloadCreateSponsoredAccountSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadCreateSponsoredAccountSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadGrantDelegation', () => {
      expect(isPayloadAddProvider(ExamplePayloadGrantDelegationSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadGrantDelegationSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadPublicGraphKey', () => {
      expect(isPayloadItemActions(ExamplePayloadPublicGraphKeySr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadPublicGraphKeySr25519()])).toBe(true);
    });
  });

  describe('isPayloads Multi', () => {
    it('is successful with all types', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGood(),
          ExamplePayloadCreateSponsoredAccountSr25519(),
          ExamplePayloadGrantDelegationSr25519(),
          ExamplePayloadPublicGraphKeySr25519(),
        ])
      ).toBe(true);
    });

    it('will fail with one bad one', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGood(),
          ExamplePayloadCreateSponsoredAccountSr25519(),
          ExamplePayloadGrantDelegationSr25519(),
          ExamplePayloadPublicGraphKeySr25519(),
          {},
        ])
      ).toBe(false);
    });
  });
});
