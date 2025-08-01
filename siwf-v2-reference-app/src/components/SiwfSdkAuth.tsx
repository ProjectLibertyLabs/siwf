import React, { useState, useEffect } from 'react';
import { Key, User, Mail, Loader, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWallet } from '../hooks/useWallet';
import { useSiwfSdk } from '../hooks/useSiwfSdk';
import { useTooltipTour } from '../hooks/useTooltipTour';
import { SiwfRequestGenerator } from './SiwfRequestGenerator';
import type { AccountResponse } from '../services/siwfSdk';

interface SignupFormData {
  handle: string;
  email: string;
}

export const SiwfSdkAuth: React.FC = () => {
  const { wallet } = useWallet();
  const { goToStage, currentStage } = useTooltipTour();
  const { 
    isLoading, 
    result, 
    error, 
    accountInfo,
    useTestMode,
    isWalletReady,
    authenticateAuto,
    checkAccountExists,
    getUserStatus,
    reset,
    clearError
  } = useSiwfSdk({ useTestMode: true }); // Use test mode by default

  const [currentSignedRequest, setCurrentSignedRequest] = useState<string>('');
  const [userStatus, setUserStatus] = useState<{
    isNewUser: boolean;
    existingAccount: AccountResponse | null;
    needsSignup: boolean;
  } | null>(null);
  const [signupData, setSignupData] = useState<SignupFormData>({
    handle: '',
    email: ''
  });
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Reset state when wallet changes
  useEffect(() => {
    reset();
    setCurrentSignedRequest('');
    setUserStatus(null);
    setShowSignupForm(false);
    setSignupData({ handle: '', email: '' });
  }, [wallet.account, wallet.walletType, wallet.isConnected, reset]);

  // Check user status when wallet connects
  useEffect(() => {
    if (isWalletReady && wallet.account) {
      handleCheckUserStatus();
    }
  }, [isWalletReady, wallet.account]);

  // Advance tooltip tour based on wallet connection state
  useEffect(() => {
    if (currentStage === 'wallet-needed' && wallet.isConnected) {
      setTimeout(() => goToStage('wallet-connected'), 500);
    }
  }, [wallet.isConnected, currentStage, goToStage]);

  const handleCheckUserStatus = async () => {
    if (!wallet.account) return;
    
    try {
      const status = await getUserStatus(wallet.account);
      setUserStatus(status);
      console.log('👤 User status checked:', status);
    } catch (error) {
      console.error('Failed to check user status:', error);
    }
  };

  const handleStartAuthentication = (signedRequest: string) => {
    console.log('🚀 Starting SDK-based SIWF authentication');
    setCurrentSignedRequest(signedRequest);
    clearError();
    
    // If user is new and we need signup data, show the form
    if (userStatus?.isNewUser) {
      setShowSignupForm(true);
      toast.success('Signed request generated! Please fill in signup details.');
    } else {
      // Existing user - authenticate directly
      handleAuthenticate(signedRequest);
    }
    
    // Advance tooltip tour when request is generated
    if (currentStage === 'wallet-connected') {
      setTimeout(() => goToStage('request-generated'), 500);
    }
  };

  const handleAuthenticate = async (signedRequest?: string) => {
    const requestToUse = signedRequest || currentSignedRequest;
    if (!requestToUse) {
      toast.error('No signed request available');
      return;
    }

    try {
      const signupDataToUse = userStatus?.isNewUser ? {
        handle: signupData.handle,
        email: signupData.email
      } : undefined;

      const result = await authenticateAuto(requestToUse, signupDataToUse);
      
      toast.success(
        userStatus?.isNewUser 
          ? 'Account created and authenticated successfully!' 
          : 'Login successful!'
      );
      
      setShowSignupForm(false);
      
      // Advance tooltip tour when authentication completes
      if (currentStage === 'auth-choice') {
        setTimeout(() => goToStage('authenticated'), 500);
      }
    } catch (error: any) {
      toast.error(`Authentication failed: ${error.message}`);
      console.error('Authentication error:', error);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.handle || !signupData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (signupData.handle.length < 3) {
      toast.error('Handle must be at least 3 characters long');
      return;
    }
    
    if (!signupData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    handleAuthenticate();
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
            <span className="responsive-hide-phone">SIWF Embedded SDK</span>
            <span className="responsive-show-phone">SIWF SDK</span>
          </h2>
          <p className="card-description">
            <span className="responsive-show-phone">
              Embedded wallet auth
            </span>
            {useTestMode && (
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warning)',
                marginLeft: 'var(--space-2)'
              }}>
                🧪 Test Mode
              </span>
            )}
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
                <span className="responsive-hide-phone">Connect your wallet to use embedded authentication</span>
                <span className="responsive-show-phone">Connect wallet for authentication</span>
              </p>
              <p style={{ 
                margin: '0',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)'
              }}>
                <span className="responsive-hide-phone">SDK-based auth requires a connected wallet for signing.</span>
                <span className="responsive-show-phone">SDK requires connected wallet.</span>
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
                {userStatus && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Status:</strong> 
                    <span style={{ 
                      color: userStatus.isNewUser ? 'var(--warning)' : 'var(--success)',
                      fontWeight: '500'
                    }}>
                      {userStatus.isNewUser ? '🆕 New User' : '✅ Existing User'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
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
                <span>{error}</span>
              </div>
            </div>
          )}

          {result ? (
            <div 
              className="authentication-result"
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-success)',
                border: '1px solid var(--border-success)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)'
              }}
            >
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
                Authentication Successful
              </h3>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <p><strong>Control Key:</strong> {result.controlKey}</p>
                <p><strong>MSA ID:</strong> {result.msaId || 'Pending...'}</p>
                {result.email && <p><strong>Email:</strong> {result.email}</p>}
                {result.phoneNumber && <p><strong>Phone Number:</strong> {result.phoneNumber}</p>}
                {result.signUpStatus && <p><strong>Signup Status:</strong> {result.signUpStatus}</p>}
                {result.signUpReferenceId && <p><strong>Signup Reference ID:</strong> {result.signUpReferenceId}</p>}
                {result.recoverySecret && (
                  <details style={{ marginTop: 'var(--space-2)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Recovery Secret</summary>
                    <pre style={{ 
                      marginTop: 'var(--space-2)', 
                      padding: 'var(--space-2)', 
                      backgroundColor: 'var(--bg-primary)', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      wordBreak: 'break-all'
                    }}>
                      {result.recoverySecret}
                    </pre>
                  </details>
                )}
                {result.graphKey && (
                  <details style={{ marginTop: 'var(--space-2)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Graph Key Details</summary>
                    <pre style={{ 
                      marginTop: 'var(--space-2)', 
                      padding: 'var(--space-2)', 
                      backgroundColor: 'var(--bg-primary)', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(result.graphKey, null, 2)}
                    </pre>
                  </details>
                )}
                {result.rawCredentials && result.rawCredentials.length > 0 && (
                  <details style={{ marginTop: 'var(--space-2)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                      Raw Credentials ({result.rawCredentials.length} items)
                    </summary>
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      {result.rawCredentials.map((credential: any, index: number) => (
                        <details key={index} style={{ marginBottom: 'var(--space-2)' }}>
                          <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: '500',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-primary)'
                          }}>
                            {credential.type?.join(', ') || `Credential ${index + 1}`}
                          </summary>
                          <pre style={{ 
                            marginTop: 'var(--space-1)', 
                            padding: 'var(--space-2)', 
                            backgroundColor: 'var(--bg-primary)', 
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            overflow: 'auto',
                            maxHeight: '200px'
                          }}>
                            {JSON.stringify(credential, null, 2)}
                          </pre>
                        </details>
                      ))}
                    </div>
                  </details>
                )}
                <details style={{ marginTop: 'var(--space-3)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Complete Response Data
                  </summary>
                  <pre style={{ 
                    marginTop: 'var(--space-2)', 
                    padding: 'var(--space-2)', 
                    backgroundColor: 'var(--bg-primary)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
              <button
                onClick={() => {
                  reset();
                  // Advance tooltip to completion when user starts over
                  if (currentStage === 'authenticated') {
                    setTimeout(() => goToStage('completed'), 200);
                  }
                }}
                className="frequency-btn frequency-btn-secondary"
                style={{ marginTop: 'var(--space-3)' }}
              >
                Start New Authentication
              </button>
            </div>
          ) : showSignupForm ? (
            <div 
              className="signup-form"
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)'
              }}
            >
              <h3 style={{ 
                margin: '0 0 var(--space-3) 0',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <User size={20} />
                New User Signup
              </h3>
              <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--space-1)', 
                    fontWeight: '500',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Handle (username) *
                  </label>
                  <input
                    type="text"
                    value={signupData.handle}
                    onChange={(e) => setSignupData(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="Enter your handle (e.g., alice)"
                    className="frequency-input"
                    required
                    minLength={3}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--space-1)', 
                    fontWeight: '500',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="frequency-input"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="frequency-btn frequency-btn-primary"
                    style={{ flex: 1 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="spinning" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account & Authenticate'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignupForm(false)}
                    className="frequency-btn frequency-btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="siwf-request-generator">
              <SiwfRequestGenerator 
                onStartAuthentication={handleStartAuthentication}
                walletInfo={wallet.isConnected && wallet.account && wallet.walletType ? {
                  account: wallet.account,
                  walletType: wallet.walletType
                } : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 