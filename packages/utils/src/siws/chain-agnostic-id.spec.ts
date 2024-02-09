import { ChainAgnosticId, POLKADOT_CHAIN_NAMESPACE, PolkadotChainId } from './chain-agnostic-id.js';
import { BlockHash } from '@polkadot/types/interfaces';
import { describe, test, expect } from 'vitest';

describe('chain-agnostic-id', () => {
  describe('class ChainAgnosticId', () => {
    let id: ChainAgnosticId;

    test('constructor', () => {
      id = new ChainAgnosticId('eip155', 'some-reference');
      expect(id.namespace).toStrictEqual('eip155');
      expect(id.reference).toStrictEqual('some-reference');
    });

    test('toString formats string correctly', () => {
      expect(id.toString()).toStrictEqual('eip155:some-reference');
    });
  });

  describe('class PolkadotChainId', () => {
    const blockHash: string = '0x060ca79d9743b0ca58cabe294b9545a492e69de00c65154dba1f236b4a3ae5c0';
    const canonicalBlockHash: string = '060ca79d9743b0ca58cabe294b9545a4';

    test('construct with string', () => {
      const p = new PolkadotChainId(blockHash);
      expect(p.namespace).toStrictEqual(POLKADOT_CHAIN_NAMESPACE);
      expect(p.reference).toStrictEqual(canonicalBlockHash);
    });

    test('construct with BlockHash', () => {
      // Mock a BlockHash; all we require is that it have a toString() method
      const blockHashObj = {
        toString: () => blockHash,
      } as BlockHash;

      const p = new PolkadotChainId(blockHashObj);
      expect(p.namespace).toStrictEqual(POLKADOT_CHAIN_NAMESPACE);
      expect(p.reference).toStrictEqual(canonicalBlockHash);
    });
  });
});
