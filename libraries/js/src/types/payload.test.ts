import {
  ExamplePayloadCreateSponsoredAccountSecp256k1,
  ExamplePayloadCreateSponsoredAccountSr25519,
  ExamplePayloadGrantDelegationSecp256k1,
  ExamplePayloadGrantDelegationSr25519,
  ExamplePayloadLoginGoodSr25519,
  ExamplePayloadPublicGraphKeySecp256k1,
  ExamplePayloadPublicGraphKeySr25519,
  ExamplePayloadRecoveryCommitmentSecp256k1,
  ExamplePayloadRecoveryCommitmentSr25519,
} from '../mocks/payloads.js';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  isPayloadAddProvider,
  isPayloadItemActions,
  isPayloadLogin,
  isPayloadRecoveryCommitment,
  isPayloads,
} from './payload.js';
import { cryptoWaitReady } from '@polkadot/util-crypto';

describe('Payload Types and Type Predicates', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  describe('isPayloads Single', () => {
    it('is successful with ExamplePayloadLoginGood', () => {
      expect(isPayloadLogin(ExamplePayloadLoginGoodSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadLoginGoodSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadCreateSponsoredAccountSr25519', () => {
      expect(isPayloadAddProvider(ExamplePayloadCreateSponsoredAccountSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadCreateSponsoredAccountSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadGrantDelegationSr25519', () => {
      expect(isPayloadAddProvider(ExamplePayloadGrantDelegationSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadGrantDelegationSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadPublicGraphKeySr25519', () => {
      expect(isPayloadItemActions(ExamplePayloadPublicGraphKeySr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadPublicGraphKeySr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadCreateSponsoredAccountSecp256k1', () => {
      expect(isPayloadAddProvider(ExamplePayloadCreateSponsoredAccountSecp256k1())).toBe(true);
      expect(isPayloads([ExamplePayloadCreateSponsoredAccountSecp256k1()])).toBe(true);
    });

    it('is successful with ExamplePayloadGrantDelegationSecp256k1', () => {
      expect(isPayloadAddProvider(ExamplePayloadGrantDelegationSecp256k1())).toBe(true);
      expect(isPayloads([ExamplePayloadGrantDelegationSecp256k1()])).toBe(true);
    });

    it('is successful with ExamplePayloadPublicGraphKeySecp256k1', () => {
      expect(isPayloadItemActions(ExamplePayloadPublicGraphKeySecp256k1())).toBe(true);
      expect(isPayloads([ExamplePayloadPublicGraphKeySecp256k1()])).toBe(true);
    });

    it('is successful with ExamplePayloadRecoveryCommitmentSr25519', () => {
      expect(isPayloadRecoveryCommitment(ExamplePayloadRecoveryCommitmentSr25519())).toBe(true);
      expect(isPayloads([ExamplePayloadRecoveryCommitmentSr25519()])).toBe(true);
    });

    it('is successful with ExamplePayloadRecoveryCommitmentSecp256k1', () => {
      expect(isPayloadRecoveryCommitment(ExamplePayloadRecoveryCommitmentSecp256k1())).toBe(true);
      expect(isPayloads([ExamplePayloadRecoveryCommitmentSecp256k1()])).toBe(true);
    });
  });

  describe('isPayloads Multi', () => {
    it('is successful with all types Sr25519', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGoodSr25519(),
          ExamplePayloadCreateSponsoredAccountSr25519(),
          ExamplePayloadGrantDelegationSr25519(),
          ExamplePayloadPublicGraphKeySr25519(),
          ExamplePayloadRecoveryCommitmentSr25519(),
        ])
      ).toBe(true);
    });

    it('will fail with one bad one Sr25519', () => {
      expect(
        isPayloads([
          ExamplePayloadLoginGoodSr25519(),
          ExamplePayloadCreateSponsoredAccountSr25519(),
          ExamplePayloadGrantDelegationSr25519(),
          ExamplePayloadPublicGraphKeySr25519(),
          ExamplePayloadRecoveryCommitmentSr25519(),
          {},
        ])
      ).toBe(false);
    });

    it('is successful with all types Secp256k1', () => {
      expect(
        isPayloads([
          ExamplePayloadCreateSponsoredAccountSecp256k1(),
          ExamplePayloadGrantDelegationSecp256k1(),
          ExamplePayloadPublicGraphKeySecp256k1(),
          ExamplePayloadRecoveryCommitmentSecp256k1(),
        ])
      ).toBe(true);
    });

    it('will fail with one bad one Secp256k1', () => {
      expect(
        isPayloads([
          ExamplePayloadCreateSponsoredAccountSecp256k1(),
          ExamplePayloadGrantDelegationSecp256k1(),
          ExamplePayloadPublicGraphKeySecp256k1(),
          ExamplePayloadRecoveryCommitmentSecp256k1(),
          {},
        ])
      ).toBe(false);
    });
  });
});
