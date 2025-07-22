import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { WalletConnect } from './components/WalletConnect';
import { SiwfLogin } from './components/SiwfLogin';
import { useWallet } from './hooks/useWallet';
import { initializeSiwfCallback } from './utils/siwf';
import './App.css';

function App() {
  const { wallet } = useWallet();
  const [rerenderCounter, setRerenderCounter] = useState(0);
  
  // Create a unique key based on wallet state to force re-rendering on wallet changes
  const walletKey = `${wallet.walletType || 'none'}-${wallet.account || 'none'}-${wallet.isConnected}-${rerenderCounter}`;

  // Initialize SIWF callback handling on mount
  useEffect(() => {
    initializeSiwfCallback(
      (result) => {
        console.log('✅ SIWF authentication successful:', result);
        toast.success('SIWF authentication completed!');
      },
      (error) => {
        console.error('❌ SIWF authentication failed:', error);
        toast.error('SIWF authentication failed: ' + error.message);
      }
    );
  }, []);

  // Force re-render when wallet state changes
  useEffect(() => {
    console.log('🔄 App: Wallet state changed, forcing component re-render', {
      walletType: wallet.walletType,
      account: wallet.account?.slice(0, 8) + '...',
      isConnected: wallet.isConnected,
      newKey: walletKey
    });
    
    setRerenderCounter(prev => prev + 1);
  }, [wallet.account, wallet.walletType, wallet.isConnected]);

  return (
    <div className="app">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--gray-800)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.875rem',
          },
        }}
      />
      
      {/* Header with Frequency Branding */}
      <header className="app-header">
        <div className="frequency-container">
          <div className="header-content">
            <div className="brand-section">
              <div className="frequency-logo">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                  <path 
                    d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h10v2H8v-2z" 
                    fill="white"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#5B45FF" />
                      <stop offset="100%" stopColor="#4A3AE0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="brand-text">
                <h1 className="app-title">Sign In With Frequency(SIWF) v2</h1>
                <p className="app-subtitle">
                  <span className="responsive-hide-phone">Demo Application • Frequency Blockchain Integration</span>
                  <span className="responsive-show-phone">SIWF Demo</span>
                </p>
              </div>
            </div>
            <div className="wallet-status">
              <div className="status-indicator">
                <span className={`status-dot ${wallet.isConnected ? 'connected' : 'disconnected'}`}></span>
                <span className="status-text">
                  <span className="responsive-hide-phone">
                    {wallet.isConnected ? `Connected: ${wallet.walletType}` : 'Not Connected'}
                  </span>
                  <span className="responsive-show-phone">
                    {wallet.isConnected ? '🟢' : '🔴'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-grid frequency-grid-2">
          <div className="grid-item">
            <WalletConnect key={`wallet-connect-${walletKey}`} />
          </div>
          <div className="grid-item">
            <SiwfLogin key={`siwf-login-${walletKey}`} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="frequency-container">
          <div className="footer-content">
            <div className="footer-links">
              <a 
                href="https://docs.frequency.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                <span className="responsive-hide-phone">Frequency Documentation</span>
                <span className="responsive-show-phone">Docs</span>
              </a>
              <span className="footer-separator responsive-hide-phone">•</span>
              <a 
                href="https://projectlibertylabs.github.io/siwf/v2/docs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                <span className="responsive-hide-phone">SIWF Documentation</span>
                <span className="responsive-show-phone">SIWF</span>
              </a>
            </div>
            <div className="debug-section">
              <small className="debug-info">
                <span className="responsive-hide-phone">
                  Render #{rerenderCounter} • {wallet.walletType || 'No Wallet'} • {wallet.isConnected ? '🟢' : '🔴'}
                </span>
                <span className="responsive-show-phone">
                  #{rerenderCounter}
                </span>
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
