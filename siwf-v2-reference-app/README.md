# SIWF v2 Reference Application

A comprehensive React + TypeScript reference implementation demonstrating **Sign In With Frequency (SIWF) v2** integration using the embedded wallet SDK approach. This application showcases cross-wallet compatibility with both MetaMask and Polkadot.js wallets, implementing real cryptographic signatures and complete authentication flows.

## 🎯 Project Overview

Unlike traditional OAuth flows, this implementation leverages cryptographic signatures directly from user wallets to authenticate with the Frequency blockchain.

### Key Concepts

- **SIWF (Sign In With Frequency)**: The Frequency chains authentication standard that uses cryptographic signatures instead of passwords
- **Embedded SDK**: Handles the authentication flow, handshakes, and signatures
- **Cross-Chain Signatures**: EIP-712 for MetaMask, CAIP-122 for Polkadot wallets
- **MSA (Message Source Account)**: Frequency's account system for managing identities and permissions

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │────│  SIWF SDK        │────│ Frequency       │
│                 │    │                  │    │ Gateway         │
│ • Wallet UI     │    │ • Signature Mgmt │    │                 │
│ • Auth Flow     │    │ • Payload Encode │    │ • Account Mgmt  │
│ • State Mgmt    │    │ • Cross-wallet   │    │ • MSA Operations│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    User Wallets         │
                    │                         │
                    │ • MetaMask (EIP-712)    │
                    │ • Polkadot.js (CAIP-122)│
                    └─────────────────────────┘
```

## 📁 Project Structure

```
src/
├── components/           # React UI components
│   ├── SiwfSdkAuth.tsx  # Main SIWF authentication interface
│   ├── SiwfLogin.tsx    # Traditional SIWF login flow
│   ├── WalletConnect.tsx # Wallet connection UI
│   └── MockAuthenticator.tsx # Development testing component
├── hooks/               # Custom React hooks
│   ├── useSiwfSdk.ts   # SIWF SDK integration hook
│   ├── useWallet.ts    # Wallet management hook
│   └── useTooltipTour.ts # UI guidance system
├── services/           # Business logic and API calls
│   └── siwfSdk.ts     # SIWF SDK service layer
├── utils/             # Utility functions
│   └── siwf.ts       # SIWF request generation and validation
└── types.ts          # TypeScript type definitions
```

## 🔐 Signature Flows

### Login Flow (1 signature)
```
User → Sign CAIP-122 message → Gateway verification → Authentication complete
```

### Signup Flow (up to 4 signatures)
```
User → 1. Add Provider Payload (EIP-712)
     → 2. Claim Handle Payload (EIP-712)  
     → 3. Graph Key Payload (EIP-712) [optional]
     → 4. Recovery Secret (EIP-712) [optional]
     → MSA creation → Authentication complete
```

### Cross-Wallet Compatibility
- **MetaMask**: Native EIP-712 structured data signing
- **Polkadot.js**: EIP-712 converted to human-readable personal_sign messages

## 🚀 Quick Start

### Prerequisites

1. **Node.js v22+**
2. **Frequency Gateway Server** running on `localhost:3013` (optional, gateway is mocked out of the box)
3. **Wallet Extensions**:
   - [MetaMask](https://metamask.io/) for Ethereum/Solidity
   - [Polkadot.js Extension](https://polkadot.js.org/extension/) for Polkadot/Substrate

### Installation

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd siwf-v2-reference-app
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Start Development**:
   ```bash
   # Terminal 1: Start your Frequency Gateway if you're running one locally
   # (Gateway should run on localhost:3013)
   
   # Terminal 2: Start the reference app
   npm run dev
   ```

4. **Test the Application**:
   - Open `http://localhost:5173`
   - Connect a wallet (MetaMask or Polkadot.js)
   - Test SIWF authentication flows

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Gateway Service Configuration
REACT_APP_GATEWAY_URL=http://localhost:3013

# Development/Testing Configuration
REACT_APP_USE_MOCK_GATEWAY=false

# Debug Configuration
REACT_APP_DEBUG_MODE=false
```

### API Proxy Configuration

The Vite development server proxies API calls to avoid CORS issues when using a local Gateway:
- Frontend: `http://localhost:5173/api/*`
- Proxied to: `http://localhost:3013/*`

## 🧩 Key Components

### `useSiwfSdk` Hook
Central hook managing SIWF SDK integration:
- Gateway communication
- Signature function creation
- Account status checking
- Authentication orchestration

### `useWallet` Hook  
Cross-wallet management:
- MetaMask and Polkadot.js support
- Signature method abstraction
- Connection state management
- Chain-specific adaptations

### `SiwfSdkAuth` Component
Main authentication interface:
- User status detection (new vs existing)
- Signup form handling
- Authentication flow management
- Real-time feedback and guidance

### Signature Service
Handles cryptographic operations:
- EIP-712 typed data signing (MetaMask)
- Personal message signing (Polkadot.js)
- Cross-wallet compatibility layer
- Signature verification

## 🔄 Development Workflow

### Mock vs Real Gateway

**Mock Mode** (`REACT_APP_USE_MOCK_GATEWAY=true`):
- Uses pre-defined responses
- No external dependencies
- Ideal for UI/UX development
- Fast iteration cycles

**Real Gateway Mode** (`REACT_APP_USE_MOCK_GATEWAY=false`):
- Connects to actual Frequency Gateway
- Real blockchain interactions
- End-to-end testing
- Production-like behavior

### Testing Flows

1. **Wallet Connection**: Test both MetaMask and Polkadot.js
2. **New User Signup**: Complete 4-signature registration flow
3. **Existing User Login**: Single signature authentication
4. **Error Handling**: Network issues, signature rejections
5. **State Management**: Wallet switching, page refreshes

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure Gateway server is running on `localhost:3013`
- Check Vite proxy configuration in `vite.config.ts`

**Wallet Not Detected**
- Verify browser extensions are installed and enabled
- Check for wallet conflicts (multiple wallet extensions)
- Ensure wallet is unlocked and connected

**Signature Failures**
- Verify wallet has sufficient funds for gas (MetaMask)
- Check network connectivity to Frequency Gateway
- Enable debug mode for detailed logging

**Development vs Production**
- Mock gateway responses may differ from real gateway
- Test with real gateway before production deployment
- Verify all environment variables are configured

## 📚 Additional Resources

- [SIWF v2 Specification](https://projectlibertylabs.github.io/siwf/v2/)
- [EIP-712 Standard](https://eips.ethereum.org/EIPS/eip-712)
- [CAIP-122 Specification](https://chainagnostic.org/CAIPs/caip-122)
- [Frequency Documentation](https://docs.frequency.xyz)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Submit a pull request with detailed description

For detailed SDK integration information, see [README-SDK-INTEGRATION.md](./README-SDK-INTEGRATION.md).
