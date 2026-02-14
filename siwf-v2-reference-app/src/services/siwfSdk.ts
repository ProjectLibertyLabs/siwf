import { 
  startSiwf, 
  getAccountForAccountId
} from '@projectlibertylabs/siwf-embedded-wallet-sdk';
import { u8aToHex } from '@polkadot/util';
import { addressToEvm } from '@polkadot/util-crypto';

// Type definitions based on SDK internals
export type Address = `0x${string}`;

export interface WindowEthereumRequest {
  method: string;
  params: any[];
}

export type SignatureFn = (request: WindowEthereumRequest) => Promise<string>;

export type GatewayFetchFn = (
  method: 'GET' | 'POST',
  path: string,
  body?: { authorizationPayload: string }
) => Promise<Response>;

export interface AccountResponse {
  msaId: string;
  handle?: {
    base_handle: string;
    canonical_base: string;
    suffix: number;
  };
}

export interface GraphKeySubject {
  id: string;
  encodedPublicKeyValue: string;
  encodedPrivateKeyValue: string;
  encoding: 'base16';
  format: 'bare';
  type: 'X25519';
  keyType: 'dsnp.public-key-key-agreement';
}

export interface GatewaySiwfResponse {
  controlKey: string;
  signUpReferenceId?: string;
  signUpStatus?: string;
  msaId?: string;
  email?: string;
  phoneNumber?: string;
  graphKey?: GraphKeySubject;
  rawCredentials?: object[];
  recoverySecret?: string;
}

export type MsaCreationCallbackFn = (account: AccountResponse) => void;

export interface SiwfSdkConfig {
  gatewayBaseUrl: string;
}

export interface SiwfAuthOptions {
  accountId: string;
  encodedSiwfSignedRequest: string;
  signUpHandle?: string;
  signUpEmail?: string;
  onMsaCreated?: MsaCreationCallbackFn;
}

export interface SiwfSdkResult {
  isLoading: boolean;
  result: GatewaySiwfResponse | null;
  error: string | null;
}

/**
 * Converts a Polkadot SS58 address to Ethereum format (0x prefixed hex)
 * Returns the address unchanged if it's already in Ethereum format
 */
export function convertToEthereumAddress(address: string): string {
  // If already ethereum format (0x prefixed), return as-is
  if (address.startsWith('0x') && address.length === 42) {
    return address;
  }
  
  try {
    // Convert SS58 to EVM address
    const evmBytes = addressToEvm(address);
    const ethereumAddress = u8aToHex(evmBytes);
    console.log(`🔄 Converted SS58 address ${address} to Ethereum format: ${ethereumAddress}`);
    return ethereumAddress;
  } catch (error) {
    console.error('❌ Failed to convert address:', error);
    throw new Error(`Invalid address format: ${address}. Must be either Ethereum (0x...) or valid SS58 format.`);
  }
}

/**
 * Validates and converts an address to the format expected by the SDK
 */
export function prepareAccountIdForSdk(accountId: string, walletType: 'metamask' | 'polkadot'): string {
  if (walletType === 'metamask') {
    // MetaMask addresses should already be in Ethereum format
    if (!accountId.startsWith('0x') || accountId.length !== 42) {
      throw new Error('Invalid MetaMask address format');
    }
    return accountId;
  } else if (walletType === 'polkadot') {
    // Convert Polkadot SS58 address to Ethereum format
    return convertToEthereumAddress(accountId);
  } else {
    throw new Error(`Unsupported wallet type: ${walletType}`);
  }
}

/**
 * Creates a gateway fetch function that communicates with the Frequency Gateway Account Service
 */
export function createGatewayFetchFn(config: SiwfSdkConfig): GatewayFetchFn {
  return async (method: 'GET' | 'POST', path: string, body?: { authorizationPayload: string }) => {
    const url = new URL(config.gatewayBaseUrl + path);
    
    console.log(`🌐 Gateway ${method} request to: ${url.toString()}`);
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
      console.log('🌐 Request body:', body);
    }

    try {
      const response = await fetch(url.toString(), requestOptions);
      console.log(`🌐 Gateway response status: ${response.status}`);
      return response;
    } catch (error) {
      console.error('🌐 Gateway fetch error:', error);
      throw error;
    }
  };
}

/**
 * Creates a signature function that adapts wallet signing methods to the SDK interface
 */
export function createSignatureFn(
  signMessage: (message: string) => Promise<string>,
  signTypedData: (typedData: any) => Promise<string>,
  walletType: 'metamask' | 'polkadot',
  connectedChainId?: number
): SignatureFn {
  return async (request: any) => {
    console.log(`🔐 Signature request:`, request);
    console.log(`🔐 Request method: ${request.method}, wallet: ${walletType}`);
    
    try {
      if (request.method === 'eth_signTypedData_v4') {
        if (walletType !== 'metamask') {
          // For Polkadot wallets, convert EIP-712 to personal_sign
          console.log('🔄 Converting EIP-712 to personal_sign for Polkadot wallet');
          const [, typedData] = request.params;
          
          // Extract the message from EIP-712 typed data
          // This is a simplified approach - in production you might want more sophisticated conversion
          let messageToSign = '';
          
          if (typedData && typedData.message) {
            // Try to create a human-readable message from the typed data
            const message = typedData.message;
            const domain = typedData.domain;
            
            messageToSign = `Sign to ${domain?.name || 'Frequency'}:\n\n`;
            
            // Add each field from the message
            Object.entries(message).forEach(([key, value]) => {
              messageToSign += `${key}: ${value}\n`;
            });
            
            messageToSign += `\nDomain: ${domain?.name || 'Unknown'}`;
            messageToSign += `\nChain ID: ${domain?.chainId || 'Unknown'}`;
          } else {
            // Fallback to stringifying the entire typed data
            messageToSign = `Sign structured data:\n${JSON.stringify(typedData, null, 2)}`;
          }
          
          console.log('🔐 Converted message for Polkadot signing:', messageToSign);
          return await signMessage(messageToSign);
        }
        
        // MetaMask handling - typedData is already an object, don't parse it
        const [, typedData] = request.params;
        console.log('🔐 Signing typed data with MetaMask');
        console.log('🔐 Original TypedData object:', typedData);
        
        // Fix chainId mismatch: Replace Frequency chainId with connected network chainId
        // This allows MetaMask to sign when connected to any Ethereum network
        const targetChainId = connectedChainId ? `0x${connectedChainId.toString(16)}` : "0x1";
        const modifiedTypedData = {
          ...typedData,
          domain: {
            ...typedData.domain,
            chainId: targetChainId
          }
        };
        
        console.log('🔄 Modified chainId from', typedData.domain?.chainId, 'to', modifiedTypedData.domain.chainId, 
                   `(connected chainId: ${connectedChainId})`);
        console.log('🔐 Modified TypedData object:', modifiedTypedData);
        
        return await signTypedData(modifiedTypedData);
      }
      
      if (request.method === 'personal_sign') {
        const [, message] = request.params; // Second parameter is the message
        console.log(`🔐 Signing message with ${walletType}`);
        console.log(`🔐 Message to sign:`, message);
        return await signMessage(message);
      }
      
      throw new Error(`Unsupported signing method: ${request.method}`);
    } catch (error) {
      console.error('🔐 Signature error:', error);
      throw error;
    }
  };
}

/**
 * Creates a mock gateway fetch function for development testing
 */
export function createMockGatewayFetchFn(): GatewayFetchFn {
  return async (method: 'GET' | 'POST', path: string, body?: { authorizationPayload: string }) => {
    console.log(`🧪 Mock Gateway ${method} request to: ${path}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (path.includes('/accounts/account/')) {
      const accountId = path.split('/').pop();
      console.log(`🧪 Mock: Looking up account ${accountId}`);
      
      // Handle our mock provider account from SIWF request generator
      const mockProviderKey = 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH';
      
      // Check if this is the mock provider account 
      if (accountId === mockProviderKey || accountId?.includes(mockProviderKey.slice(0, 20))) {
        console.log('💼 Mock: Returning mock provider account');
        return new Response(JSON.stringify({
          msaId: '999999', // Mock provider MSA ID
          handle: { base_handle: 'mockprovider', canonical_base: 'mockprovider', suffix: 1 }
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // For demo, return existing account for addresses containing 'existing'
      if (accountId?.includes('existing')) {
        console.log('👤 Mock: Returning existing user account');
        return new Response(JSON.stringify({
          msaId: '12345',
          handle: { base_handle: 'testuser', canonical_base: 'testuser', suffix: 1 }
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.log('🆕 Mock: Account not found - treating as new user');
        return new Response('Not Found', { status: 404 });
      }
    }
    
    if (path === '/v2/accounts/siwf') {
      console.log('🧪 Mock: Processing SIWF authentication');
      const mockResponse: GatewaySiwfResponse = {
        controlKey: '0x1234567890abcdef1234567890abcdef12345678',
        msaId: Math.floor(Math.random() * 100000).toString(),
        signUpStatus: 'complete',
        email: body?.authorizationPayload ? 'user@example.com' : undefined,
        graphKey: {
          id: 'mock-graph-key-id',
          encodedPublicKeyValue: '0xabcdef1234567890abcdef1234567890abcdef12',
          encodedPrivateKeyValue: '0xfedcba0987654321fedcba0987654321fedcba09',
          encoding: 'base16' as const,
          format: 'bare' as const,
          type: 'X25519' as const,
          keyType: 'dsnp.public-key-key-agreement' as const
        }
      };
      
      return new Response(JSON.stringify(mockResponse), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/v1/frequency/blockinfo') {
      console.log('🧪 Mock: Returning block info');
      return new Response(JSON.stringify({
        blocknumber: 12345,
        finalized_blocknumber: 12340,
        genesis: '0x1234567890abcdef',
        runtime_version: 1
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw new Error(`Mock gateway: Unsupported path ${path}`);
  };
}

/**
 * Main SDK integration function that handles both login and signup
 */
export async function authenticateWithSdk(
  options: SiwfAuthOptions,
  signatureFn: SignatureFn,
  gatewayFetchFn: GatewayFetchFn,
  walletType: 'metamask' | 'polkadot'
): Promise<GatewaySiwfResponse> {
  console.log('🚀 Starting SIWF SDK authentication');
  console.log('🚀 Options:', {
    accountId: options.accountId,
    walletType,
    hasSignedRequest: !!options.encodedSiwfSignedRequest,
    signUpHandle: options.signUpHandle,
    signUpEmail: options.signUpEmail
  });

  try {
    // Convert account ID to format expected by SDK
    const sdkAccountId = prepareAccountIdForSdk(options.accountId, walletType);
    console.log('🔄 Using SDK account ID:', sdkAccountId);

    const result = await startSiwf(
      sdkAccountId,
      signatureFn,
      gatewayFetchFn,
      options.encodedSiwfSignedRequest,
      options.signUpHandle,
      options.signUpEmail,
      options.onMsaCreated
    );

    console.log('✅ SIWF SDK authentication successful:', result);
    return result;
  } catch (error) {
    console.error('❌ SIWF SDK authentication failed:', error);
    throw error;
  }
}

/**
 * Get account information for a given account ID
 */
export async function getAccountInfo(
  accountId: string,
  gatewayFetchFn: GatewayFetchFn,
  walletType?: 'metamask' | 'polkadot'
): Promise<AccountResponse | null> {
  console.log('🔍 Getting account info for:', accountId, 'wallet type:', walletType);
  
  try {
    // Convert account ID to format expected by SDK if needed
    const sdkAccountId = walletType ? prepareAccountIdForSdk(accountId, walletType) : accountId;
    
    const result = await getAccountForAccountId(gatewayFetchFn, sdkAccountId);
    console.log('✅ Account info retrieved:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to get account info:', error);
    throw error;
  }
} 