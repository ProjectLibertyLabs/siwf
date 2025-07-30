import { useState, useCallback, useMemo } from 'react';
import { 
  createGatewayFetchFn, 
  createMockGatewayFetchFn,
  createSignatureFn,
  authenticateWithSdk,
  getAccountInfo,
  type SiwfSdkConfig,
  type SiwfAuthOptions,
  type SiwfSdkResult,
  type GatewaySiwfResponse,
  type AccountResponse
} from '../services/siwfSdk';
import { useWallet } from './useWallet';

export interface UseSiwfSdkOptions {
  useTestMode?: boolean;
  gatewayBaseUrl?: string;
  authToken?: string;
}

export const useSiwfSdk = (options: UseSiwfSdkOptions = {}) => {
  const { wallet, signMessage, signTypedData } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GatewaySiwfResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountResponse | null>(null);

  // Configuration - use test mode by default or from environment
  const useTestMode = options.useTestMode ?? 
    (import.meta.env.REACT_APP_USE_MOCK_GATEWAY === 'true');
  
  const sdkConfig: SiwfSdkConfig = useMemo(() => ({
    gatewayBaseUrl: options.gatewayBaseUrl || 
      import.meta.env.REACT_APP_GATEWAY_URL || 
      'http://localhost:3001',
    authHeaders: {
      'Authorization': `Bearer ${options.authToken || import.meta.env.REACT_APP_GATEWAY_TOKEN || 'demo-token'}`,
      'X-API-Key': import.meta.env.REACT_APP_GATEWAY_API_KEY || '',
    }
  }), [options.gatewayBaseUrl, options.authToken]);

  // Create gateway fetch function based on test mode
  const gatewayFetchFn = useMemo(() => {
    if (useTestMode) {
      console.log('🧪 Using mock gateway for SIWF SDK');
      return createMockGatewayFetchFn();
    } else {
      console.log('🌐 Using real gateway for SIWF SDK:', sdkConfig.gatewayBaseUrl);
      return createGatewayFetchFn(sdkConfig);
    }
  }, [useTestMode, sdkConfig]);

  // Check if current account exists on chain
  const checkAccountExists = useCallback(async (accountId?: string) => {
    const targetAccountId = accountId || wallet.account;
    if (!targetAccountId) {
      throw new Error('No account ID provided');
    }

    setIsLoading(true);
    setError(null);

    try {
      const account = await getAccountInfo(targetAccountId, gatewayFetchFn, wallet.walletType || undefined);
      setAccountInfo(account);
      return account;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet.account, gatewayFetchFn]);

  // Main authentication function
  const authenticate = useCallback(async (authOptions: SiwfAuthOptions) => {
    if (!wallet.isConnected || !wallet.account || !wallet.walletType) {
      throw new Error('Wallet not connected');
    }

    console.log('🚀 Starting SIWF SDK authentication with wallet:', {
      walletType: wallet.walletType,
      account: wallet.account,
      isConnected: wallet.isConnected
    });

    setIsLoading(true);
    setError(null);

    try {
      // Create signature function for the current wallet
      const signatureFn = createSignatureFn(signMessage, signTypedData, wallet.walletType, wallet.chainId);

      // Execute authentication
      const authResult = await authenticateWithSdk(
        {
          ...authOptions,
          accountId: authOptions.accountId || wallet.account,
        },
        signatureFn,
        gatewayFetchFn,
        wallet.walletType
      );

      setResult(authResult);
      console.log('✅ Authentication completed successfully');
      return authResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      console.error('❌ Authentication failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet, signMessage, signTypedData, gatewayFetchFn]);

  // Helper function to determine if user is new or existing
  const getUserStatus = useCallback(async (accountId?: string) => {
    try {
      const account = await checkAccountExists(accountId);
      return {
        isNewUser: account === null,
        existingAccount: account,
        needsSignup: account === null
      };
    } catch (error) {
      console.error('Error checking user status:', error);
      return {
        isNewUser: true, // Default to new user if check fails
        existingAccount: null,
        needsSignup: true
      };
    }
  }, [checkAccountExists]);

  // Simplified authentication that auto-detects login vs signup
  const authenticateAuto = useCallback(async (
    signedRequest: string,
    signupData?: { handle: string; email: string }
  ) => {
    if (!wallet.account) {
      throw new Error('No wallet account available');
    }

    // Check if user exists
    const userStatus = await getUserStatus(wallet.account);
    console.log('👤 User status:', userStatus);

    if (userStatus.isNewUser && !signupData) {
      throw new Error('New user detected but signup data not provided');
    }

    return await authenticate({
      accountId: wallet.account,
      encodedSiwfSignedRequest: signedRequest,
      signUpHandle: userStatus.isNewUser ? signupData?.handle : undefined,
      signUpEmail: userStatus.isNewUser ? signupData?.email : undefined,
      onMsaCreated: (account) => {
        console.log('🎉 MSA created for new user:', account);
        setAccountInfo(account);
      }
    });
  }, [wallet.account, getUserStatus, authenticate]);

  // Reset all state
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setAccountInfo(null);
    setIsLoading(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    result,
    error,
    accountInfo,
    
    // Configuration
    useTestMode,
    isWalletReady: wallet.isConnected && wallet.account && wallet.walletType,
    
    // Methods
    authenticate,
    authenticateAuto,
    checkAccountExists,
    getUserStatus,
    reset,
    clearError,
    
    // Wallet info
    walletInfo: {
      isConnected: wallet.isConnected,
      account: wallet.account,
      walletType: wallet.walletType
    }
  };
}; 