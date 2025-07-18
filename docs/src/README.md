# Sign In With Frequency Developer Documentation and Tools

Sign In With Frequency (SIWF) provides documentation and tools to use with SIWF-compatible services such as [Frequency Access](https://frequencyaccess.com) (an easy-to-use custodial social wallet for users on Frequency).

[JavaScript Quick Start](./QuickStart.md)

## Overview

There are a few main steps to authenticating using SIWF-compatible systems.

For example, when using Frequency Access:

1. Your application sends the user the Frequency Access Authentication URL
2. Frequency Access verifies the user, and the user signs the requested payload(s)
3. Frequency Access sends the signed user payloads back to your application
4. If needed, your application sends the signed payloads to Frequency
5. Your application logs in the user, and the user's session begins

### Actors

- Your Application: Any website, mobile application, etc. for which your user needs authentication
- SIWF service (e.g. Frequency Access): Verifies the user and provides the user with access to the entire Frequency Ecosystem
- Frequency Blockchain: Manages user delegations and additional social operations

### User Delegations and Credentials

SIWF allows you to request that a user give you various delegations such as private graph changes, and credentials such as verified email.

- See a full list of [Available Credentials](./Credentials.md)
- See a full list of [Available Delegations](./Delegations.md)

## Staging & Production

### Using Frequency Access

Frequency Access has two deployments: Staging-Testnet and Production-Mainnet.

#### Production-Mainnet

URL: `www.frequencyaccess.com`

- Uses Frequency Mainnet
- Supports both SMS and Email verification
- Bot protection via [hCaptcha](https://www.hcaptcha.com/)
- Authorization Timeout: 30 seconds

#### Staging-Testnet

URL: `testnet.frequencyaccess.com`

- Uses Frequency Testnet on Paseo
- Supports ONLY Email and will not send SMS verification codes
- No uptime guarantees
- Limited bot protection
- May rate limit usage
- Authorization Timeout: 30 seconds

## Prerequisites

- Have registered your application as a [Provider on Frequency](https://provider.frequency.xyz)
- Have access to a Frequency RPC Node

## Terms

- Frequency Provider: The identity of the application registered on Frequency
- Staging-Testnet: The staging environment
- Production-Mainnet: The production environment
- MSA: The Frequency blockchain account for a user
- SR25519: Schnorr signatures using `ed25519` over ECDSA
- Secp256k1: Elliptic curve used in Ethereum for digital signatures and keys.
- Delegation: The user permission for an application to act on their behalf
- Credential: Verified data about the user provided with permission of the user
