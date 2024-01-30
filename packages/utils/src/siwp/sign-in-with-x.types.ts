/// Types and classes to correspond to CAIP-122 "Sign in with X"
/// https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md

import { ChainAgnosticAddress } from './chain-agnostic-address';
export type SIWxPayload = {
  /// RFC 4501 dnsauthority that is requesting the signing.
  domain: string;

  /// Blockchain address performing the signing;
  /// as defined by CAIP-10,  should include CAIP-2 chain id namespace
  /// (ref. CAIP-13 for Polkadot addresses)
  iss: ChainAgnosticAddress;

  /// RFC 3986 URI referring to the resource that is the subject of the signing i.e. the subject of the claim.
  uri: URL;

  /// Current version of the message.
  version: string;

  /// Human-readable ASCII assertion that the user will sign. It MUST NOT contain \n.
  statement?: string;

  /// Randomized token to prevent signature replay attacks.
  nonce?: string;

  /// RFC 3339 date-time that indicates the issuance time.
  /// ex: YYYY-MM-DDThh:mm:ss[.sss][Z|-6:00]
  issuedAt?: Date;

  /// RFC 3339 date-time that indicates when the signed authentication message is no longer valid.
  /// ex: YYYY-MM-DDThh:mm:ss[.sss][Z|-6:00]
  expirationTime?: Date;

  /// RFC 3339 date-time that indicates when the signed authentication message starts being valid.
  /// ex: YYYY-MM-DDThh:mm:ss[.sss][Z|-6:00]
  notBefore?: Date;

  /// System-specific identifier used to uniquely refer to the authentication request.
  requestId?: string;

  /// List of information or references to information the user wishes to have resolved
  /// as part of the authentication by the relying party; express as RFC 3986 URIs and separated by \n.
  resources?: string[];
};

export type SIWxPayloadApi = {
  /// Method for converting payload to a string representation for signing as in CAIP-122
  // toMessage(): string;
  toMessage: () => string;

  /// Method for converting payload to raw bytes for signing as in CAIP-122
  toBytes: () => Uint8Array;
};

export type SIWxSignatureMeta = Record<string, never>;

export type SIWxSignature = {
  /// Signature algorithm used to sign the payload
  signatureType: string;

  meta?: SIWxSignatureMeta;

  /// Signature of the message signed by the wallet.
  signature: Uint8Array;
};

// Type alias here for future expandability; CAIP-74 envisions
// a header component in addition to the payload, though we don't
// have any use for it right now.
export type SIWxRequest = {
  payload: SIWxPayload;
};

export type SIWxResponse = SIWxRequest & {
  signature: SIWxSignature;
};
