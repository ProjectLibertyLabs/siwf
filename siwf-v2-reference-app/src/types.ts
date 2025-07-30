// Wallet Types
export type WalletType = 'metamask' | 'polkadot';

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  walletType: WalletType | null;
  isConnecting: boolean;
  error: string | null;
  chainId?: number;
}

export interface PolkadotAccount {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
}

// SIWF Types
export interface SiwfOptions {
  handle: string;
  email: string;
}

export interface SiwfResult {
  msaId?: string;
  accountId?: string;
  handle?: string;
  credentials?: any;
  isNewUser?: boolean;
  authMode?: string;
  mockAuthData?: {
    authorizationCode: string;
    authorizationPayload: string;
  };
  accountResponse?: any;
}

export interface SiwfState {
  isLoading: boolean;
  result: SiwfResult | null;
  error: string | null;
}

// API Response Types
export interface GatewayResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface MsaResponse {
  msaId: string;
  providerId: string;
}

// Signature Function Types
export interface SignatureParams {
  account: string;
  walletType: WalletType;
}

export type SignatureFunction = (data: any, params: SignatureParams) => Promise<string>; 