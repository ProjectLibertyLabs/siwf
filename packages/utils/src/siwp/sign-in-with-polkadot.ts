/// Types and classes to correspond to CAIP-122 "Sign in with X"
/// https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md

import { SIWxPayload, SIWxPayloadApi, SIWxSignature } from './sign-in-with-x.types';

export class SignInWithPolkadot implements SIWxPayloadApi {
  payload: SIWxPayload;

  constructor(payload: SIWxPayload) {
    this.payload = payload;
  }

  public readonly toMessage = (): string => {
    return `${this.payload.domain} wants you to sign in with your Polkadot account:
${this.payload.iss.address}${
      this.payload.statement
        ? `

${this.payload.statement}`
        : ''
    }

URI: ${this.payload.uri.toString()}
Version: ${this.payload.version}${
      this.payload.nonce
        ? `
Nonce: ${this.payload.nonce}`
        : ''
    }${
      this.payload.issuedAt
        ? `
Issued At: ${this.payload.issuedAt.toLocalISOString()}`
        : ''
    }${
      this.payload.expirationTime
        ? `
Expiration Time: ${this.payload.expirationTime.toLocalISOString()}`
        : ''
    }${
      this.payload.notBefore
        ? `
Not Before: ${this.payload.notBefore.toLocalISOString()}`
        : ''
    }${
      this.payload.requestId
        ? `
Request ID: ${this.payload.requestId}`
        : ''
    }
Chain ID: ${this.payload.iss.chainId.reference}${
      this.payload.resources && this.payload.resources.length > 0
        ? `
Resources:
${this.payload.resources.map((resource) => `- ${resource}`).join('\n')}`
        : ''
    }
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
