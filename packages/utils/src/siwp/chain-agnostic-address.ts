/// Implementation of CAIP-10 Account ID Specification

import { ChainAgnosticId, ChainNamepace, PolkadotChainId } from './chain-agnostic-id.js';
import { BlockHash } from '@polkadot/types/interfaces';

export class ChainAgnosticAddress {
  public readonly chainId: ChainAgnosticId;
  public readonly address: string;

  constructor(id: ChainAgnosticId, a: string);
  constructor(n: ChainNamepace, r: string, a: string);
  constructor(id: ChainAgnosticId | ChainNamepace, refOrAddress: string, address?: string) {
    if (id instanceof ChainAgnosticId) {
      this.chainId = id;
      this.address = refOrAddress;
    } else if (typeof address === 'undefined') {
      throw new Error('No address supplied');
    } else {
      this.chainId = new ChainAgnosticId(id, refOrAddress);
      this.address = address;
    }
  }

  public toString(): string {
    return `${this.chainId.toString()}:${this.address}`;
  }
}

export class PolkadotAddress extends ChainAgnosticAddress {
  constructor(genesis: string | BlockHash | ChainAgnosticId, address: string) {
    const id = genesis instanceof ChainAgnosticId ? genesis : new PolkadotChainId(genesis);
    super(id, address);
  }
}
