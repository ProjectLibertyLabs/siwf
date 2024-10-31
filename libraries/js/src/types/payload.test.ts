import {
  ExamplePayloadCreateSponsoredAccount,
  ExamplePayloadGrantDelegation,
  ExamplePayloadLoginGood,
  ExamplePayloadPublicGraphKey,
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
      expect(isPayloadAddProvider(ExamplePayloadCreateSponsoredAccount())).toBe(true);
      expect(isPayloads([ExamplePayloadCreateSponsoredAccount()])).toBe(true);
    });

    it('is successful with ExamplePayloadGrantDelegation', () => {
      expect(isPayloadAddProvider(ExamplePayloadGrantDelegation())).toBe(true);
      expect(isPayloads([ExamplePayloadGrantDelegation()])).toBe(true);
    });

    it('is successful with ExamplePayloadPublicGraphKey', () => {
      expect(isPayloadItemActions(ExamplePayloadPublicGraphKey())).toBe(true);
      expect(isPayloads([ExamplePayloadPublicGraphKey()])).toBe(true);
    });
  });

  describe('isPayloads Multi', () => {
    it('is successful with all types', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGood(),
          ExamplePayloadCreateSponsoredAccount(),
          ExamplePayloadGrantDelegation(),
          ExamplePayloadPublicGraphKey(),
        ])
      ).toBe(true);
    });

    it('will fail with one bad one', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGood(),
          ExamplePayloadCreateSponsoredAccount(),
          ExamplePayloadGrantDelegation(),
          ExamplePayloadPublicGraphKey(),
          {},
        ])
      ).toBe(false);
    });
  });
});
