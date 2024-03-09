export enum Network {
  ROCOCO = 'https://rpc.rococo.frequency.xyz',
  LOCALHOST = 'http://localhost:9944',
  MAINNET = 'https://rpc.frequency.xyz',
}

export enum ProxyUrl {
  DEV = 'http://localhost:5173',
}

export enum SignUpCall {
  CreateSponsoredAccountWithDelegation = 'createSponsoredAccountWithDelegation',
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
}
