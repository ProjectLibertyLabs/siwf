export enum Network {
  LOCALHOST = 'http://localhost:9944',
}

export enum ProxyUrl {
  DEV = 'http://localhost:5173',
}

export enum SignUpCall {
  CreateSponsoredAccountWithDelegation = 'createSponsoredAccountWithDelegation',
  GrantDelegation = 'grantDelegation',
  ClaimHandle = 'claimHandle',
}

export enum SignupError {
  InvalidSignature = 'Invalid signature',
  ExpiredSignature = 'Transaction signature is expired',
  UnsupportedExtrinsic = 'Unsupported extrinsic call',
  InvalidMsaId = 'Invalid MSA ID',
  SignupKeysMismatch = 'Signing keys do not match',
  InvalidHex = 'Expected hex-encoded call',
  ApiNotReady = 'API is not ready',
  ResponseError = 'Error from response',
}

export enum SigninError {
  InvalidMessage = 'Invalid message',
  InvalidSignature = 'Invalid signature',
  ExpiredSignature = 'Signature is expired',
  InvalidMsaId = 'Invalid MSA ID',
  InvalidHex = 'Expected hex-encoded signature',
  ApiNotReady = 'API is not ready',
  ResponseError = 'Error from response',
}
