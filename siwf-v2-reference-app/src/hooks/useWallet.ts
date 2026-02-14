import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage, useSignTypedData } from 'wagmi';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import toast from 'react-hot-toast';
import type { WalletState, WalletType } from '../types';

// Extend window to include injected wallets
declare global {
  interface Window {
    ethereum?: any;
    injectedWeb3?: Record<string, any>;
  }
}

// LocalStorage keys for persisting wallet state
const WALLET_DISCONNECTED_KEY = 'siwf_wallet_disconnected';
const WALLET_TYPE_KEY = 'siwf_wallet_type';

export const useWallet = () => {
  const [polkadotWallet, setPolkadotWallet] = useState<{
    isConnected: boolean;
    account: string | null;
    isConnecting: boolean;
    error: string | null;
  }>({
    isConnected: false,
    account: null,
    isConnecting: false,
    error: null,
  });

  // Wagmi hooks for MetaMask
  const { address: wagmiAddress, isConnected: wagmiIsConnected, chainId: wagmiChainId } = useAccount();
  const { connect, connectors, isPending: isConnectingWagmi } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessage: wagmiSignMessage } = useSignMessage();
  const { signTypedData: wagmiSignTypedData } = useSignTypedData();

  // Check if wallets are available
  const isMetaMaskAvailable = () => typeof window.ethereum !== 'undefined';
  const isPolkadotAvailable = () => {
    const available = typeof window.injectedWeb3 !== 'undefined';
    if (!available) {
      console.log('🔍 Polkadot.js extension not detected. Make sure the extension is installed and enabled.');
    } else {
      console.log('🔍 Polkadot.js extension detected:', Object.keys(window.injectedWeb3 || {}));
    }
    return available;
  };

  // Check if user previously disconnected
  const wasManuallyDisconnected = () => {
    return localStorage.getItem(WALLET_DISCONNECTED_KEY) === 'true';
  };

  // Get the current wallet state
  const getCurrentWalletState = (): WalletState => {
    const lastWalletType = localStorage.getItem(WALLET_TYPE_KEY) as WalletType;
    
    // Check MetaMask (wagmi)
    if (wagmiIsConnected && wagmiAddress) {
      return {
        isConnected: true,
        account: wagmiAddress,
        walletType: 'metamask',
        isConnecting: isConnectingWagmi,
        error: null,
        chainId: wagmiChainId,
      };
    }
    
    // Check Polkadot
    if (polkadotWallet.isConnected && polkadotWallet.account) {
      return {
        isConnected: true,
        account: polkadotWallet.account,
        walletType: 'polkadot',
        isConnecting: polkadotWallet.isConnecting,
        error: polkadotWallet.error,
        chainId: undefined, // Polkadot doesn't use Ethereum chainId
      };
    }
    
    // Return disconnected state
    return {
      isConnected: false,
      account: null,
      walletType: null,
      isConnecting: isConnectingWagmi || polkadotWallet.isConnecting,
      error: polkadotWallet.error,
      chainId: undefined,
    };
  };

  const wallet = getCurrentWalletState();

  // Clear disconnect flag and store wallet type
  const setConnected = (walletType: WalletType) => {
    localStorage.removeItem(WALLET_DISCONNECTED_KEY);
    localStorage.setItem(WALLET_TYPE_KEY, walletType);
  };

  // Set disconnect flag and clear wallet type
  const setDisconnected = () => {
    localStorage.setItem(WALLET_DISCONNECTED_KEY, 'true');
    localStorage.removeItem(WALLET_TYPE_KEY);
  };

  // Check existing connections on load
  useEffect(() => {
    // Don't auto-connect if user previously disconnected
    if (wasManuallyDisconnected()) {
      console.log('🚫 Skipping auto-connection - user previously disconnected');
      return;
    }
    
    checkExistingConnections();
  }, []);

  const checkExistingConnections = async () => {
    // Get the last used wallet type
    const lastWalletType = localStorage.getItem(WALLET_TYPE_KEY) as WalletType;
    
    // MetaMask auto-connection is handled by wagmi
    // We only need to check Polkadot.js manually
    if (lastWalletType === 'polkadot' || !lastWalletType) {
      try {
        const extensions = await web3Enable('SIWF Frontend');
        if (extensions.length > 0) {
          const accounts = await web3Accounts();
          if (accounts.length > 0) {
            setPolkadotWallet({
              isConnected: true,
              account: accounts[0].address,
              isConnecting: false,
              error: null,
            });
            setConnected('polkadot');
          }
        }
      } catch (error) {
        console.error('Error checking Polkadot.js connection:', error);
      }
    }
  };

  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskAvailable()) {
      const error = 'Please install MetaMask wallet extension';
      toast.error(error);
      return;
    }

    try {
      // Find MetaMask connector - it might have different IDs depending on wagmi version
      const metaMaskConnector = connectors.find(connector => 
        connector.id === 'metaMask' || 
        connector.id === 'io.metamask' || 
        connector.name?.toLowerCase().includes('metamask')
      );
      
      if (metaMaskConnector) {
        console.log('Found MetaMask connector:', metaMaskConnector.id, metaMaskConnector.name);
        connect({ connector: metaMaskConnector });
        setConnected('metamask');
      } else {
        console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
        throw new Error('MetaMask connector not found');
      }
    } catch (error: any) {
      console.error('Error connecting MetaMask:', error);
      toast.error('Failed to connect MetaMask: ' + error.message);
    }
  }, [connect, connectors]);

  const connectPolkadot = useCallback(async () => {
    if (!isPolkadotAvailable()) {
      toast.error('Polkadot.js extension not found. Please install it first.');
      return;
    }

    setPolkadotWallet(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      console.log('🔌 Attempting to connect to Polkadot.js extension...');
      
      // Enable the extension
      const extensions = await web3Enable('SIWF Frontend');
      console.log('🔌 Available extensions:', extensions.map(ext => ({ name: ext.name, version: ext.version })));
      
      if (extensions.length === 0) {
        throw new Error('Please install Polkadot.js extension');
      }

      // Get accounts
      const accounts = await web3Accounts();
      console.log('🔌 Available accounts:', accounts.map(acc => ({ address: acc.address, name: acc.meta.name })));
      
      if (accounts.length === 0) {
        const errorMsg = 'No accounts found in Polkadot.js extension. Please create an account in the extension first.';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      // Use the first account for now
      const account = accounts[0];
      console.log('✅ Selected account:', { address: account.address, name: account.meta.name });

      setPolkadotWallet({
        isConnected: true,
        account: account.address,
        isConnecting: false,
        error: null,
      });
      setConnected('polkadot');
      toast.success(`Connected to Polkadot.js: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
    } catch (error: any) {
      console.error('❌ Error connecting Polkadot.js:', error);
      const errorMessage = 'Failed to connect Polkadot.js: ' + error.message;
      setPolkadotWallet(prev => ({ 
        ...prev, 
        isConnecting: false, 
        error: errorMessage 
      }));
      toast.error(errorMessage);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    if (wallet.walletType === 'metamask') {
      wagmiDisconnect();
    } else if (wallet.walletType === 'polkadot') {
      setPolkadotWallet({
        isConnected: false,
        account: null,
        isConnecting: false,
        error: null,
      });
    }
    setDisconnected();
    toast.success('Wallet disconnected');
  }, [wagmiDisconnect, wallet.walletType]);

  // Sign typed data (EIP-712) - MetaMask only
  const signTypedData = useCallback(async (typedData: any) => {
    if (!wallet.isConnected || !wallet.account) {
      throw new Error('Wallet not connected');
    }

    if (wallet.walletType !== 'metamask') {
      throw new Error('Typed data signing only supported with MetaMask');
    }

    try {
      return new Promise<string>((resolve, reject) => {
        wagmiSignTypedData(
          {
            domain: typedData.domain,
            types: typedData.types,
            primaryType: typedData.primaryType,
            message: typedData.message,
          },
          {
            onSuccess: (signature) => resolve(signature),
            onError: (error) => reject(error),
          }
        );
      });
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw error;
    }
  }, [wallet, wagmiSignTypedData]);

  // Sign message - works with both wallets
  const signMessage = useCallback(async (message: string) => {
    if (!wallet.isConnected || !wallet.account) {
      throw new Error('Wallet not connected');
    }

    try {
      if (wallet.walletType === 'metamask') {
        return new Promise<string>((resolve, reject) => {
          wagmiSignMessage(
            { message },
            {
              onSuccess: (signature) => resolve(signature),
              onError: (error) => reject(error),
            }
          );
        });
      } else if (wallet.walletType === 'polkadot') {
        const injector = await web3FromAddress(wallet.account);
        const signRaw = injector?.signer?.signRaw;
        
        if (!signRaw) {
          throw new Error('Polkadot.js signer not available');
        }

        const { signature } = await signRaw({
          address: wallet.account,
          data: stringToHex(message),
          type: 'bytes'
        });

        return signature;
      } else {
        throw new Error('Unknown wallet type');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }, [wallet, wagmiSignMessage]);

  // Sign SIWF request payload with sr25519 for Polkadot wallets
  const signSiwfRequest = useCallback(async (payload: string) => {
    if (!wallet.isConnected || !wallet.account) {
      throw new Error('Wallet not connected');
    }

    if (wallet.walletType !== 'polkadot') {
      throw new Error('SIWF request signing is only supported for Polkadot wallets');
    }

    try {
      console.log('🔐 Signing SIWF request payload with sr25519');
      console.log('🔐 Payload to sign:', payload);

      const injector = await web3FromAddress(wallet.account);
      const signRaw = injector?.signer?.signRaw;
      
      if (!signRaw) {
        throw new Error('Polkadot.js signer not available');
      }

      // Convert payload to bytes for signing
      const payloadBytes = stringToU8a(payload);
      
      const { signature } = await signRaw({
        address: wallet.account,
        data: u8aToHex(payloadBytes),
        type: 'bytes'
      });

      console.log('✅ SIWF request signed successfully');
      return signature;
    } catch (error) {
      console.error('❌ Error signing SIWF request:', error);
      throw error;
    }
  }, [wallet]);

  // Get public key for Polkadot wallet (for SIWF requests)
  const getPolkadotPublicKey = useCallback(async () => {
    if (!wallet.isConnected || !wallet.account || wallet.walletType !== 'polkadot') {
      throw new Error('Polkadot wallet not connected');
    }

    try {
      // Get account info from Polkadot extension
      const accounts = await web3Accounts();
      const account = accounts.find(acc => acc.address === wallet.account);
      
      if (!account) {
        throw new Error('Account not found in Polkadot extension');
      }

      // The public key is available in the account object
      return account.address; // For now, we'll use the address as the public key identifier
    } catch (error) {
      console.error('❌ Error getting Polkadot public key:', error);
      throw error;
    }
  }, [wallet]);

  // Handle wagmi connection success
  useEffect(() => {
    if (wagmiIsConnected && wagmiAddress) {
      setConnected('metamask');
      toast.success(`Connected to MetaMask: ${wagmiAddress.slice(0, 6)}...${wagmiAddress.slice(-4)}`);
    }
  }, [wagmiIsConnected, wagmiAddress]);

  // Handle wagmi disconnection
  useEffect(() => {
    if (!wagmiIsConnected && localStorage.getItem(WALLET_TYPE_KEY) === 'metamask') {
      // Only set disconnected if we were previously connected to MetaMask
      if (!wasManuallyDisconnected()) {
        toast('MetaMask account disconnected');
      }
    }
  }, [wagmiIsConnected]);

  return {
    wallet,
    isMetaMaskAvailable: isMetaMaskAvailable(),
    isPolkadotAvailable: isPolkadotAvailable(),
    connectMetaMask,
    connectPolkadot,
    disconnectWallet,
    signTypedData,
    signMessage,
    signSiwfRequest,
    getPolkadotPublicKey,
  };
}; 