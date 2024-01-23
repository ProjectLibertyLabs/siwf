/// Implementation of CAIP-2 Blockchain ID Specification

import { BlockHash } from '@polkadot/types/interfaces';

// Valid chain namespaces. The concept of a chain namespace is defined in CAIP-2,
// but there does not seem to be a canonical list of valid chain namespaces (or at least,
// for anything but Ethereum-based chains). CAIP-13 defines the namespace for Polkadot, which
// is all we care about here.
export type ChainNamepace = 'polkadot' | 'eip155'; // extend with other namespaces as necessary/desired

export class ChainAgnosticId {
  public readonly namespace: ChainNamepace;
  public readonly reference: string;

  constructor(id: ChainNamepace, r: string) {
    this.namespace = id;
    this.reference = r;
  }

  public toString(): string {
    return `${this.namespace}:${this.reference}`;
  }
}

export const POLKADOT_CHAIN_NAMESPACE: ChainNamepace = 'polkadot';

export class PolkadotChainId extends ChainAgnosticId {
  constructor(genesis: string | BlockHash) {
    const ref = typeof genesis === 'string' ? genesis : genesis.toString();
    super(POLKADOT_CHAIN_NAMESPACE, ref.replace(/^0x/, '').slice(0, 32));
  }
}
