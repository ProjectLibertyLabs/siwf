# Frequency Control Panel

## Description
The Frequency Control Panel is an application that facilitates using a selected Polkadot-compatible crypto wallet to perform certain basic DSNP operations over Frequency.

### Supported Operations

#### Phase 1
* Sign up using Frequency
* Sign in using Frequency

#### Future Phases (projected)
* Stake/unstake to provider
* Revoke provider delegations
* Key management

## Architecture/Design

### Description
As currently designed, the Frequency Control Panel is a Single-Page Application (SPA) that runs in a local browser component. Interfacing with various wallets is achieved through interaction with either a supported browser extension (web/mobile) or an installed native app (mobile only)

### Data flow
For the supported Phase I operations (Sign Up/Sign In), we will implement the emerging [Web3 Auth standard](https://web3auth.io/docs/). The user/data flows will look as follows:
* [Sign-up flow](./docs/signup-flow.md)
* [Sign-in flow](./docs/login-flow.md)
