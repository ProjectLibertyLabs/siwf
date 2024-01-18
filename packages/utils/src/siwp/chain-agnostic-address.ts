/// Implementation of CAIP-10 Account ID Specification

import { ChainAgnosticId, ChainNamepace, POLKADOT_CHAIN_NAMESPACE, PolkadotChainId } from './chain-agnostic-id.js';
import { BlockHash } from '@polkadot/types/interfaces';

export class ChainAgnosticAddress extends ChainAgnosticId {
  public readonly address: string;

  constructor(id: ChainAgnosticId, a: string);
  constructor(n: ChainNamepace, r: string, a: string);
  constructor(id: ChainAgnosticId | ChainNamepace, refOrAddress: string, address?: string) {
    if (id instanceof ChainAgnosticId) {
      super(id.namespace, id.reference);
      this.address = refOrAddress;
    } else if (typeof address === 'undefined') {
      throw new Error('No address supplied');
    } else {
      super(id, refOrAddress);
      this.address = address;
    }
  }

  public toChainId(): string {
    return super.toString();
  }

  public toString(): string {
    return `${super.toString()}:${this.address}`;
  }
}

export class PolkadotAddress extends ChainAgnosticAddress {
  constructor(genesis: string | BlockHash | ChainAgnosticId, address: string) {
    const id = genesis instanceof ChainAgnosticId ? genesis : new PolkadotChainId(genesis);
    super(id, address);
  }
}