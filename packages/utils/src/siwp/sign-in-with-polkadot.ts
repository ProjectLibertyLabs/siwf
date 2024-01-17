/// Types and classes to correspond to CAIP-122 "Sign in with X"
/// https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md

import { SIWxPayload, SIWxPayloadDataOnly, SIWxSignature } from './sign-in-with-x.types';
import { ChainAgnosticAddress } from './chain-agnostic-address';

export class SIWPPayload implements SIWxPayload {
  domain: string;
  iss: ChainAgnosticAddress;
  uri: URL;
  version: string;
  statement?: string;
  nonce?: string;
  issuedAt?: Date;
  expirationTime?: Date;
  notBefore?: Date;
  requestId?: string;
  resources?: string[];

  constructor(obj?: SIWxPayloadDataOnly) {
    Object.assign(this, obj);
  }

  public readonly toMessage = (): string => {
    return `${this.domain} wants you to sign in with your Polkadot account:
${this.iss.address}

${this.statement}

URI: ${this.uri.toString()}
Version: ${this.version}
Nonce: ${this.nonce}
Issued At: ${this.issuedAt?.toISOString()}
Expiration Time: ${this.expirationTime?.toISOString()}
Not Before: ${this.notBefore?.toISOString()}
Request ID: ${this.requestId}
Chain ID: ${this.iss.reference}
Resources:
${this.resources?.map((resource) => `- ${resource}`).join('\n')}
`;
  };

  public readonly toBytes = (): Uint8Array => {
    const te = new TextEncoder();
    return te.encode(this.toMessage());
  };
}

export type SIWPSignature = SIWxSignature & {
  signatureType: 'sr25519' | 'ed25519';
};
