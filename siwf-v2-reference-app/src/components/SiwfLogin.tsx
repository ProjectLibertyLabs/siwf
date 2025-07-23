import React, { useState, useEffect } from 'react';
import { Key, User, Mail, Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWallet } from '../hooks/useWallet';
import { SiwfRequestGenerator } from './SiwfRequestGenerator';
import { MockAuthenticator } from './MockAuthenticator';
import type { SiwfResult, SiwfState } from '../types';

export const SiwfLogin: React.FC = () => {
  const { wallet } = useWallet();
  const [siwfState, setSiwfState] = useState<SiwfState>({
    isLoading: false,
    result: null,
    error: null
  });
  const [showMockAuth, setShowMockAuth] = useState(false);
  const [currentSignedRequest, setCurrentSignedRequest] = useState<string>('');

  // Reset SIWF state when wallet changes
  useEffect(() => {
    setSiwfState({
      isLoading: false,
      result: null,
      error: null
    });
    setShowMockAuth(false);
    setCurrentSignedRequest('');
  }, [wallet.account, wallet.walletType, wallet.isConnected]);

  const handleStartAuthentication = (signedRequest: string) => {
    console.log('🚀 Starting MOCK SIWF authentication with signed request', signedRequest);
    setCurrentSignedRequest(signedRequest);
    setShowMockAuth(true);
    toast.success('Opening mock authentication interface...');
  };

  const handleMockAuthSuccess = (result: any) => {
    console.log('✅ Mock authentication completed:', result);
    setSiwfState({
      isLoading: false,
      result: result,
      error: null
    });
    setShowMockAuth(false);
    toast.success('Authentication successful!');
  };

  const handleMockAuthCancel = () => {
    console.log('❌ Mock authentication cancelled');
    setShowMockAuth(false);
    setSiwfState({
      isLoading: false,
      result: null,
      error: null
    });
    toast('Authentication cancelled');
  };

  const getWalletDisplayName = () => {
    switch (wallet.walletType) {
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
    <div className="siwf-login">
      <div className="frequency-card">
        <div className="frequency-card-header">
          <h2 className="card-title">
            <Key className="icon" />
            <span className="responsive-hide-phone">Sign In With Frequency</span>
            <span className="responsive-show-phone">SIWF</span>
          </h2>
          <p className="card-description">
            <span className="responsive-hide-phone">Generate and use SIWF authentication requests</span>
            <span className="responsive-show-phone">Generate SIWF authentication</span>
          </p>
        </div>

        <div className="frequency-card-content">
          {!wallet.isConnected ? (
            <div 
              className="not-connected"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'var(--space-4)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <AlertTriangle 
                size={window.innerWidth <= 768 ? 20 : 24} 
                style={{ 
                  color: 'var(--warning)', 
                  marginBottom: 'var(--space-2)' 
                }} 
              />
              <p style={{ 
                margin: '0 0 var(--space-2) 0',
                color: 'var(--warning)',
                fontWeight: '500',
                fontSize: 'var(--text-sm)'
              }}>
                <span className="responsive-hide-phone">Connect your wallet to see connected account info</span>
                <span className="responsive-show-phone">Connect wallet for account info</span>
              </p>
              <p style={{ 
                margin: '0',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)'
              }}>
                <span className="responsive-hide-phone">You can still generate SIWF requests without a connected wallet.</span>
                <span className="responsive-show-phone">You can still generate SIWF requests.</span>
              </p>
            </div>
          ) : (
            <div 
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <h3 style={{ 
                margin: '0 0 var(--space-3) 0',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                textAlign: 'center'
              }}>
                <span className="responsive-hide-phone">Connected Wallet</span>
                <span className="responsive-show-phone">Wallet Info</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Type:</strong> 
                  <span style={{ color: 'var(--text-secondary)' }}>{getWalletDisplayName()}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
                  wordBreak: 'break-all'
                }}>
                  <strong style={{ color: 'var(--text-primary)', flexShrink: 0 }}>Address:</strong> 
                  <code style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    background: 'var(--bg-primary)',
                    padding: 'var(--space-1)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    {wallet.account && getShortAddress(wallet.account)}
                  </code>
                </div>
              </div>
            </div>
          )}

          {siwfState.error && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: 'var(--text-sm)'
              }}>
                <XCircle size={16} style={{ flexShrink: 0 }} />
                <span>{siwfState.error}</span>
              </div>
            </div>
          )}

          {showMockAuth ? (
            <MockAuthenticator
              signedRequest={currentSignedRequest}
              onSuccess={handleMockAuthSuccess}
              onCancel={handleMockAuthCancel}
            />
          ) : siwfState.result ? (
            <div style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--bg-success)',
              border: '1px solid var(--border-success)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ 
                margin: '0 0 var(--space-3) 0',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: 'var(--text-success)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <CheckCircle size={20} />
                Authentication Result
              </h3>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <p><strong>Mode:</strong> {siwfState.result.authMode}</p>
                <p><strong>Email:</strong> {siwfState.result.credentials?.email}</p>
                {siwfState.result.credentials?.handle && (
                  <p><strong>Handle:</strong> {siwfState.result.credentials.handle}</p>
                )}
                <p><strong>Authorization Code:</strong> {siwfState.result.mockAuthData?.authorizationCode}</p>
                {siwfState.result.accountResponse && (
                  <details style={{ marginTop: 'var(--space-2)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Account Service Response</summary>
                    <pre style={{ 
                      marginTop: 'var(--space-2)', 
                      padding: 'var(--space-2)', 
                      backgroundColor: 'var(--bg-primary)', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(siwfState.result.accountResponse, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <button
                onClick={() => setSiwfState({ isLoading: false, result: null, error: null })}
                className="frequency-btn frequency-btn-secondary"
                style={{ marginTop: 'var(--space-3)' }}
              >
                Start New Authentication
              </button>
            </div>
          ) : (
            <SiwfRequestGenerator 
              onStartAuthentication={handleStartAuthentication}
              walletInfo={wallet.isConnected && wallet.account && wallet.walletType ? {
                account: wallet.account,
                walletType: wallet.walletType
              } : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 