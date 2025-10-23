import React, { useEffect, useState } from 'react';
import { Wallet, WalletCards, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useTooltipTour } from '../hooks/useTooltipTour';

export const WalletConnect: React.FC = () => {
  const { 
    wallet, 
    isMetaMaskAvailable,
    isPolkadotAvailable,
    connectMetaMask, 
    connectPolkadot,
    disconnectWallet 
  } = useWallet();

  const { currentStage, goToStage } = useTooltipTour();
  const [justConnected, setJustConnected] = useState(false);

  // Show "just connected" feedback briefly
  useEffect(() => {
    if (wallet.isConnected) {
      setJustConnected(true);
      const timer = setTimeout(() => setJustConnected(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [wallet.account, wallet.walletType]);

  // Advance tooltip tour when connection button is about to be shown
  useEffect(() => {
    if (currentStage === 'welcome' && !wallet.isConnected) {
      // Show wallet-needed tooltip when on welcome stage and no wallet connected
      setTimeout(() => goToStage('wallet-needed'), 500);
    }
  }, [currentStage, wallet.isConnected, goToStage]);

  const handleConnectMetaMask = async () => {
    await connectMetaMask();
  };

  const handleConnectPolkadot = async () => {
    await connectPolkadot();
  };

  const getWalletTypeDisplay = (walletType: string | null) => {
    switch (walletType) {
      case 'metamask':
        return '🦊 MetaMask';
      case 'polkadot':
        return '🔴 Polkadot.js';
      default:
        return 'Unknown';
    }
  };

  const getShortAddress = (address: string) => {
    // Responsive address display - show more on larger screens
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    } else {
      return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }
  };

  return (
    <div className="wallet-connect">
      <div className={`frequency-card ${justConnected ? 'frequency-animate-fade-in' : ''}`}>
        <div className="frequency-card-header">
          <h2 className="card-title">
            <Wallet className="icon" />
            <span className="responsive-hide-phone">Wallet Connection</span>
            <span className="responsive-show-phone">Wallet</span>
          </h2>
          <p className="card-description">
            {wallet.isConnected 
              ? (
                <>
                  <span className="responsive-hide-phone">Your wallet is connected and ready to use</span>
                  <span className="responsive-show-phone">Connected and ready</span>
                </>
              )
              : (
                <>
                  <span className="responsive-hide-phone">Connect your wallet to start using Sign In With Frequency</span>
                  <span className="responsive-show-phone">Connect to start using SIWF</span>
                </>
              )
            }
          </p>
        </div>
        
        <div className="frequency-card-content">
          {!wallet.isConnected ? (
            <div className="not-connected">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <WalletCards 
                  size={window.innerWidth <= 768 ? 40 : 48} 
                  style={{ 
                    color: 'var(--frequency-primary)', 
                    marginBottom: 'var(--space-4)' 
                  }} 
                />
              </div>
              
              {wallet.error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{wallet.error}</span>
                </div>
              )}

              <div className="wallet-options">
                <h3 style={{ 
                  margin: '0 0 var(--space-4) 0',
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textAlign: 'center'
                }}>
                  <span className="responsive-hide-phone">Choose a Wallet:</span>
                  <span className="responsive-show-phone">Select Wallet:</span>
                </h3>
                
                {/* MetaMask Option */}
                <div className="wallet-option">
                  <button 
                    onClick={handleConnectMetaMask} 
                    disabled={wallet.isConnecting || !isMetaMaskAvailable}
                    className={`frequency-btn frequency-btn-lg ${
                      isMetaMaskAvailable ? 'frequency-btn-primary' : 'btn-disabled'
                    }`}
                    style={{ width: '100%' }}
                  >
                    {wallet.isConnecting ? (
                      <>
                        <Loader className="icon frequency-animate-spin" size={16} />
                        <span className="responsive-hide-phone">Connecting...</span>
                        <span className="responsive-show-phone">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>🦊</span>
                        <span className="responsive-hide-phone">Connect MetaMask</span>
                        <span className="responsive-show-phone">MetaMask</span>
                      </>
                    )}
                  </button>
                  {!isMetaMaskAvailable && (
                    <p className="wallet-note">
                      <span className="responsive-hide-phone">
                        MetaMask not detected. <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Install MetaMask</a>
                      </span>
                      <span className="responsive-show-phone">
                        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Install MetaMask</a>
                      </span>
                    </p>
                  )}
                </div>

                {/* Polkadot.js Option */}
                <div className="wallet-option">
                  <button 
                    onClick={handleConnectPolkadot} 
                    disabled={wallet.isConnecting || !isPolkadotAvailable}
                    className={`frequency-btn frequency-btn-lg ${
                      isPolkadotAvailable ? 'frequency-btn-primary' : 'btn-disabled'
                    }`}
                    style={{ width: '100%' }}
                  >
                    {wallet.isConnecting ? (
                      <>
                        <Loader className="icon frequency-animate-spin" size={16} />
                        <span className="responsive-hide-phone">Connecting...</span>
                        <span className="responsive-show-phone">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>🔴</span>
                        <span className="responsive-hide-phone">Connect Polkadot.js</span>
                        <span className="responsive-show-phone">Polkadot.js</span>
                      </>
                    )}
                  </button>
                  {!isPolkadotAvailable && (
                    <p className="wallet-note">
                      <span className="responsive-hide-phone">
                        Don't have Polkadot.js? <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">Install Extension</a>
                      </span>
                      <span className="responsive-show-phone">
                        <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">Install Polkadot.js</a>
                      </span>
                    </p>
                  )}
                  
                  {/* Troubleshooting section for Polkadot connection issues */}
                  {isPolkadotAvailable && (
                    <div className="troubleshooting-section" style={{ 
                      marginTop: 'var(--space-3)', 
                      padding: 'var(--space-3)', 
                      background: 'var(--background-secondary)', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <details>
                        <summary style={{ 
                          cursor: 'pointer', 
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          🔧 Having trouble connecting?
                        </summary>
                        <div style={{ marginTop: 'var(--space-2)' }}>
                          <p style={{ marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                            If you're getting "No accounts found" error:
                          </p>
                          <ol style={{ 
                            paddingLeft: 'var(--space-4)', 
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                          }}>
                            <li>Open the Polkadot.js extension</li>
                            <li>Create an account if you don't have one</li>
                            <li>Make sure the extension is unlocked</li>
                            <li>Allow the extension to run on this site</li>
                            <li>Refresh this page and try again</li>
                          </ol>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="connected">
              <div className="wallet-info">
                <div className="status">
                  <div 
                    className="status-dot connected"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      animation: 'pulse 2s infinite'
                    }}
                  ></div>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    <span className="responsive-hide-phone">
                      Connected via {getWalletTypeDisplay(wallet.walletType)}
                    </span>
                    <span className="responsive-show-phone">
                      {getWalletTypeDisplay(wallet.walletType)}
                    </span>
                  </span>
                  {justConnected && (
                    <CheckCircle 
                      className="icon frequency-animate-fade-in" 
                      size={16} 
                      style={{ color: 'var(--success)' }}
                    />
                  )}
                </div>
                <div className="address" style={{ wordBreak: 'break-all' }}>
                  <strong>Address:</strong> 
                  <code style={{
                    marginLeft: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    display: 'inline-block',
                    maxWidth: '100%'
                  }}>
                    {wallet.account && getShortAddress(wallet.account)}
                  </code>
                </div>
              </div>
              <button 
                onClick={disconnectWallet}
                className="frequency-btn frequency-btn-secondary"
                style={{ 
                  marginTop: 'var(--space-4)',
                  width: '100%'
                }}
              >
                <span className="responsive-hide-phone">Disconnect Wallet</span>
                <span className="responsive-show-phone">Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 