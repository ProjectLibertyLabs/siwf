import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { stringToHex } from '@polkadot/util';
import toast from 'react-hot-toast';
import type { WalletState, WalletType, PolkadotAccount } from '../types';

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
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    account: null,
    walletType: null,
    isConnecting: false,
    error: null,
  });

  // Check if wallets are available
  const isMetaMaskAvailable = () => typeof window.ethereum !== 'undefined';
  const isPolkadotAvailable = () => typeof window.injectedWeb3 !== 'undefined';

  // Check if user previously disconnected
  const wasManuallyDisconnected = () => {
    return localStorage.getItem(WALLET_DISCONNECTED_KEY) === 'true';
  };

  // Clear disconnect flag and store wallet type
  const setConnected = (walletType: WalletType, account: string) => {
    localStorage.removeItem(WALLET_DISCONNECTED_KEY);
    localStorage.setItem(WALLET_TYPE_KEY, walletType);
    setWallet({
      isConnected: true,
      account,
      walletType,
      isConnecting: false,
      error: null,
    });
  };

  // Set disconnect flag and clear wallet type
  const setDisconnected = () => {
    localStorage.setItem(WALLET_DISCONNECTED_KEY, 'true');
    localStorage.removeItem(WALLET_TYPE_KEY);
    setWallet({
      isConnected: false,
      account: null,
      walletType: null,
      isConnecting: false,
      error: null,
    });
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
    
    // Check MetaMask first if it was the last used wallet or if no preference
    if ((!lastWalletType || lastWalletType === 'metamask') && isMetaMaskAvailable()) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setConnected('metamask', accounts[0].address);
          return;
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
      }
    }

    // Check Polkadot.js if MetaMask wasn't connected or if it was the last used wallet
    if (lastWalletType === 'polkadot' || !lastWalletType) {
      try {
        const extensions = await web3Enable('SIWF Frontend');
        if (extensions.length > 0) {
          const accounts = await web3Accounts();
          if (accounts.length > 0) {
            setConnected('polkadot', accounts[0].address);
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
      setWallet(prev => ({ ...prev, error }));
      toast.error(error);
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setConnected('metamask', address);
      toast.success(`Connected to MetaMask: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (error: any) {
      console.error('Error connecting MetaMask:', error);
      const errorMessage = 'Failed to connect MetaMask: ' + error.message;
      setWallet(prev => ({ ...prev, isConnecting: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const connectPolkadot = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      // Enable the extension
      const extensions = await web3Enable('SIWF Frontend');
      
      if (extensions.length === 0) {
        throw new Error('Please install Polkadot.js extension');
      }

      // Get accounts
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in Polkadot.js extension');
      }

      // Use the first account for now
      const account = accounts[0];

      setConnected('polkadot', account.address);
      toast.success(`Connected to Polkadot.js: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
    } catch (error: any) {
      console.error('Error connecting Polkadot.js:', error);
      const errorMessage = 'Failed to connect Polkadot.js: ' + error.message;
      setWallet(prev => ({ ...prev, isConnecting: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setDisconnected();
    toast.success('Wallet disconnected');
  }, []);

  // Sign typed data (EIP-712) - MetaMask only
  const signTypedData = useCallback(async (typedData: any) => {
    if (!wallet.isConnected || !wallet.account) {
      throw new Error('Wallet not connected');
    }

    if (wallet.walletType !== 'metamask') {
      throw new Error('Typed data signing only supported with MetaMask');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const signature = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message
      );
      return signature;
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw error;
    }
  }, [wallet]);

  // Sign message - works with both wallets
  const signMessage = useCallback(async (message: string) => {
    if (!wallet.isConnected || !wallet.account) {
      throw new Error('Wallet not connected');
    }

    try {
      if (wallet.walletType === 'metamask') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return await signer.signMessage(message);
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
  }, [wallet]);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum && wallet.walletType === 'metamask') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          setDisconnected();
          toast('MetaMask account disconnected');
        } else if (accounts[0] !== wallet.account) {
          // User switched accounts
          setConnected('metamask', accounts[0]);
          toast(`Switched to account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [wallet.walletType, wallet.account]);

  return {
    wallet,
    isMetaMaskAvailable: isMetaMaskAvailable(),
    isPolkadotAvailable: isPolkadotAvailable(),
    connectMetaMask,
    connectPolkadot,
    disconnectWallet,
    signTypedData,
    signMessage,
  };
}; 