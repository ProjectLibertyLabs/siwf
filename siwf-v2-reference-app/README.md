# SIWF v2 Reference App Demo

A React + TypeScript frontend demonstrating Sign In With Frequency (SIWF) v2 integration with both MetaMask and Polkadot.js wallets.

## Prerequisites

1. **Node.js v22+**
2. **Gateway Server Running on localhost:3013**
   - The frontend proxies API requests to avoid CORS issues
   - Make sure your Frequency Gateway is running before starting the frontend
3. **Wallet Extensions**:
   - [MetaMask](https://metamask.io/) for Ethereum-style wallets
   - [Polkadot.js Extension](https://polkadot.js.org/extension/) for Substrate wallets

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Gateway Server** (in a separate terminal):
   ```bash
   # Make sure your Frequency Gateway is running on localhost:3013
   # This is required for SIWF authentication to work
   ```

3. **Start Frontend**:
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   - Navigate to `http://localhost:5173`
   - Connect your wallet (MetaMask or Polkadot.js)
   - Test SIWF authentication

## Features

- ✅ **Dual Wallet Support**: MetaMask and Polkadot.js
- ✅ **Real Crypto Signatures**: EIP-712 and CAIP-122 signing
- ✅ **Complete SIWF Flow**: Account detection, MSA creation, credential verification
- ✅ **Persistent Disconnect**: Wallet state persists across page refreshes
- ✅ **UI Re-rendering**: Clean state reset when switching wallets
- ✅ **CORS Handling**: Vite proxy configuration for Gateway API

## API Proxy

The frontend uses Vite's proxy feature to forward requests:
- Frontend requests: `http://localhost:5173/api/*`
- Proxied to: `http://localhost:3013/*`

This avoids CORS issues when calling the Gateway API from the browser.

## Troubleshooting

- **CORS Errors**: Ensure Gateway server is running on localhost:3013
- **Wallet Not Detected**: Check that wallet extensions are installed and enabled
- **SIWF Errors**: Verify Gateway is properly configured and accessible
