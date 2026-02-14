// Complete SIWF v2 Implementation
// Based on: https://projectlibertylabs.github.io/siwf/v2/docs/

import type { 
  SiwfOptions,
  SiwfResult,
  WalletType
} from '../types';

// SIWF Permission definitions from documentation
export const SIWF_PERMISSIONS = {
  // Bundles
  PUBLIC_PRIVATE_GRAPH: [6, 7, 8, 9, 10],
  DSNP_V13_CONTENT: [1, 2, 3, 4, 5],
  
  // Individual permissions
  DSNP_BROADCAST_V1: 1,           // Create new public content (v1) - Deprecated
  DSNP_PROFILE_V1: 2,             // Update profile information (v1) - Deprecated
  DSNP_REPLY_V1: 3,               // Public reply to content (v1) - Deprecated
  DSNP_TOMBSTONE_V1: 4,           // Mark content for deletion (v1) - Deprecated
  DSNP_UPDATE_V1: 5,              // Update an existing post or reply (v1)
  DSNP_BROADCAST_V2: 6,           // Create new public content (v2)
  DSNP_CONTENT_ATTRIBUTE: 7,      // Create authenticated attribute set for DSNP content (v1)
  DSNP_EXT_CONTENT_ATTRIBUTE: 8,  // Create authenticated attribute set for external content (v1)
  DSNP_PRIVATE_CONNECTIONS: 9,    // Update private friendship connections (v1)
  DSNP_PRIVATE_FOLLOWS: 10,       // Update private follow list (v1)
  DSNP_PROFILE_RESOURCES: 11,     // Update user profile information (v1)
  DSNP_PUBLIC_FOLLOWS: 12,        // Update public follow list (v1)
  DSNP_REACTION: 13,              // Public reaction to content (v1)
  DSNP_REPLY_V2: 14,              // Public reply to content (v2)
  DSNP_TOMBSTONE_V2: 15,          // Mark content for deletion (v2)
  DSNP_UPDATE_V2: 16,             // Update existing post or reply (v2)
  DSNP_USER_ATTRIBUTE_SET: 17     // Create authenticated attribute set for DSNP User (v2)
};

// Credential definitions
export const SIWF_CREDENTIALS = {
  GRAPH_KEY: {
    type: "VerifiedGraphKeyCredential",
    hash: ["bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y"]
  },
  RECOVERY_SECRET: {
    type: "VerifiedRecoverySecretCredential",
    hash: ["bciqpg6qm4rnu2j4v6ghxqqgwkggokwvxs3t2bexbd3obkypkiryylxq"]
  },
  EMAIL: {
    type: "VerifiedEmailAddressCredential",
    hash: ["bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi"]
  },
  PHONE: {
    type: "VerifiedPhoneNumberCredential",
    hash: ["bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq"]
  }
};

// Types for SIWF request generation
export interface SiwfRequestOptions {
  callbackUri: string;
  permissions: number[];
  additionalPermissions?: string;
  schemaIds?: number[];
  credentials: {
    graphKey: boolean;
    recoverySecret: boolean;
    email: boolean;
    phone: boolean;
  };
  applicationContextUrl?: string;
}

export interface SiwfSignedRequest {
  requestedSignatures: {
    publicKey: {
      encodedValue: string;
      encoding: string;
      format: string;
      type: string;
    };
    signature: {
      algo: string;
      encoding: string;
      encodedValue: string;
    };
    payload: {
      callback: string;
      permissions: number[];
      userIdentifierAdminUrl?: string;
    };
  };
  requestedCredentials?: any[];
  applicationContext?: {
    url: string;
  };
}

export interface SiwfGeneratedRequest {
  signedRequest: string;
  mainnetUrl: string;
  testnetUrl: string;
  jsonPayload: SiwfSignedRequest;
}

/**
 * Generate SIWF v2 Signed Request
 * Based on: https://projectlibertylabs.github.io/siwf/v2/docs/SignatureGeneration.html
 */
export async function generateSiwfSignedRequest(
  options: SiwfRequestOptions, 
  walletInfo?: { account: string; walletType: WalletType },
  signSiwfRequest?: (payload: string) => Promise<string>,
  getPolkadotPublicKey?: () => Promise<string>
): Promise<SiwfGeneratedRequest> {
  console.log("🔐 Generating SIWF signed request with options:", options);
  console.log("🔐 Using wallet info:", walletInfo);
  
  try {
    // Build requested credentials array
    const requestedCredentials = [];
    
    // Add individual credentials
    if (options.credentials.graphKey) {
      requestedCredentials.push(SIWF_CREDENTIALS.GRAPH_KEY);
    }
    
    if (options.credentials.recoverySecret) {
      requestedCredentials.push(SIWF_CREDENTIALS.RECOVERY_SECRET);
    }
    
    // Add anyOf credentials (email or phone)
    if (options.credentials.email || options.credentials.phone) {
      const anyOfCredentials = [];
      
      if (options.credentials.email) {
        anyOfCredentials.push(SIWF_CREDENTIALS.EMAIL);
      }
      
      if (options.credentials.phone) {
        anyOfCredentials.push(SIWF_CREDENTIALS.PHONE);
      }
      
      if (anyOfCredentials.length > 0) {
        requestedCredentials.push({ anyOf: anyOfCredentials });
      }
    }
    
    // Use real wallet signing for Polkadot wallets
    let publicKeyInfo;
    let signature;
    
    if (walletInfo?.walletType === 'polkadot' && signSiwfRequest && getPolkadotPublicKey) {
      console.log(`🔐 Using real sr25519 signing for Polkadot wallet: ${walletInfo.account}`);
      
      // Get the actual public key from the wallet
      const publicKey = await getPolkadotPublicKey();
      publicKeyInfo = {
        encodedValue: publicKey,
        encoding: "base58",
        format: "ss58", 
        type: "Sr25519"
      };
      
      // Create the payload to sign
      const payload = JSON.stringify({
        callback: options.callbackUri,
        permissions: options.permissions
      });
      
      // Sign the payload with the wallet
      signature = await signSiwfRequest(payload);
      console.log("✅ Real sr25519 signature generated");
    } else {
      // Fallback to mock data for demo purposes or when wallet functions are not available
      console.log("⚠️ Using mock signature - wallet signing functions not available or not a Polkadot wallet");
      console.log("⚠️ This is for demonstration purposes only. In production, use real wallet signing.");
      publicKeyInfo = {
        encodedValue: "f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH", // Mock public key for demo
        encoding: "base58",
        format: "ss58",
        type: "Sr25519"
      };
      signature = "0x" + "a".repeat(128); // Mock signature for demo
    }
    
    // Build the complete signed request
    const signedRequestObj: SiwfSignedRequest = {
      requestedSignatures: {
        publicKey: publicKeyInfo,
        signature: {
          algo: "SR25519",
          encoding: "base16",
          encodedValue: signature
        },
        payload: {
          callback: options.callbackUri,
          permissions: options.permissions
        }
      }
    };
    
    // Add optional fields
    if (requestedCredentials.length > 0) {
      signedRequestObj.requestedCredentials = requestedCredentials;
    }
    
    if (options.applicationContextUrl) {
      signedRequestObj.applicationContext = {
        url: options.applicationContextUrl
      };
    }
    
    // Encode to base64url
    const signedRequest = encodeSignedRequest(signedRequestObj);
    
    // Generate URLs
    const mainnetUrl = generateAuthenticationUrl(signedRequest, undefined, 'production');
    const testnetUrl = generateAuthenticationUrl(signedRequest, undefined, 'staging');
    
    console.log("✅ SIWF signed request generated successfully");
    
    return {
      signedRequest,
      mainnetUrl,
      testnetUrl,
      jsonPayload: signedRequestObj
    };
    
  } catch (error) {
    console.error("❌ Failed to generate SIWF signed request:", error);
    throw error;
  }
}

/**
 * Encode signed request to base64url
 */
function encodeSignedRequest(signedRequest: SiwfSignedRequest): string {
  const jsonString = JSON.stringify(signedRequest);
  return btoa(jsonString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate authentication URL
 */
function generateAuthenticationUrl(
  signedRequest: string,
  additionalParams?: URLSearchParams,
  endpoint: 'production' | 'staging' = 'staging'
): string {
  const baseUrl = endpoint === 'production'
    ? 'https://www.frequencyaccess.com/siwa/start'
    : 'https://testnet.frequencyaccess.com/siwa/start';
  
  const params = new URLSearchParams();
  params.set('signedRequest', signedRequest);
  
  if (additionalParams) {
    additionalParams.forEach((value, key) => {
      params.set(key, value);
    });
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Handle SIWF callback and extract authorization code
 */
export function handleSiwfCallback(callbackUrl: string): {
  authorizationCode?: string;
  sessionId?: string;
  additionalParams: Record<string, string>;
} {
  const url = new URL(callbackUrl);
  const params = new URLSearchParams(url.search);
  
  const authorizationCode = params.get('authorizationCode') || undefined;
  const sessionId = params.get('sessionId') || undefined;
  
  const additionalParams: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key !== 'authorizationCode' && key !== 'sessionId') {
      additionalParams[key] = value;
    }
  });
  
  return {
    authorizationCode,
    sessionId,
    additionalParams
  };
}

/**
 * Retrieve login result using authorization code
 */
export async function getLoginResult(
  authorizationCode: string,
  endpoint: 'production' | 'staging' = 'staging'
): Promise<any> {
  const baseUrl = endpoint === 'production'
    ? 'https://www.frequencyaccess.com/siwa/api/payload'
    : 'https://testnet.frequencyaccess.com/siwa/api/payload';
  
  const url = `${baseUrl}?authorizationCode=${encodeURIComponent(authorizationCode)}`;
  
  console.log('🔍 Fetching SIWF login result:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`SIWF API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ SIWF login result received');
    
    return result;
  } catch (error) {
    console.error('❌ Failed to get SIWF login result:', error);
    throw error;
  }
}

/**
 * Initialize SIWF callback handler
 * Call this to check if the current page is a SIWF callback
 */
export function initializeSiwfCallback(
  onSuccess: (result: any) => void,
  onError: (error: Error) => void
): void {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('authorizationCode');
  
  if (authorizationCode) {
    console.log("🔄 SIWF callback detected, processing...");
    
    getLoginResult(authorizationCode, 'staging')
      .then(result => {
        console.log("✅ SIWF callback processed successfully:", result);
        onSuccess(result);
      })
      .catch(error => {
        console.error("❌ SIWF callback processing failed:", error);
        onError(error);
      });
  }
}

// Legacy compatibility functions
export function validateAccountId(accountId: string, walletType: WalletType): boolean {
  if (walletType === 'metamask') {
    return /^0x[a-fA-F0-9]{40}$/.test(accountId);
  } else if (walletType === 'polkadot') {
    return accountId.length >= 40;
  }
  return false;
}

export function createSignatureFn(
  signTypedData: (data: any) => Promise<string>,
  signMessage: (message: string) => Promise<string>,
  walletType: WalletType,
  account: string
) {
  return async (request: any, accountId: string): Promise<string> => {
    if (walletType === 'metamask') {
      if (request.method === "eth_signTypedData_v4") {
        const [address, typedDataString] = request.params;
        const typedData = JSON.parse(typedDataString);
        return await signTypedData(typedData);
      }
      if (request.method === "personal_sign") {
        const [message, address] = request.params;
        return await signMessage(message);
      }
    } else if (walletType === 'polkadot') {
      if (request.method === "personal_sign") {
        const [message, address] = request.params;
        return await signMessage(message);
      }
    }
    throw new Error(`Unsupported signing method: ${request.method}`);
  };
}

export async function siwfLogin(
  options: SiwfOptions,
  signatureFn: (...args: any[]) => Promise<string>,
  onMsaCreated: (account: any) => void,
  accountId: string,
  walletType: WalletType
): Promise<SiwfResult> {
  console.log("🚀 SIWF Login - use the SIWF Request Generator instead");
  console.log("⚠️ Legacy function - please use generateSiwfSignedRequest with real wallet signing");
  throw new Error("Please use the SIWF Request Generator to start authentication");
} 