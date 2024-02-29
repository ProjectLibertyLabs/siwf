# Frequency Control Panel

## Description
The Frequency Control Panel is an application that facilitates using a selected Polkadot-compatible crypto wallet to perform certain basic DSNP operations over Frequency.

This includes facilitating the sign-in and sign-up of a user.

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
For the supported Phase I operations (Sign Up/Sign In), we will implement the emerging [Sign In With Substrate standard](https://siws.xyz/). The user/data flows will look as follows:
* [Sign-up flow](./docs/signup-flow.md)
* [Sign-in flow](./docs/login-flow.md)

### Developing
Install [pnpm](https://pnpm.io/installation)
Start-up local-chain [Frequency](https://hub.docker.com/r/dsnp/instant-seal-node-with-deployed-schemas/tags)

```
pnpm build
```
```
cd ./packages/apps/frequency-wallet-proxy
```
```
pnpm install
```
```
pnpm dev
```
```
cd ./packages/apps/example
```
```
pnpm install
```
```
pnpm dev
```

Both example application and control-panel should look like this * [demo video]("https://www.loom.com/share/63551846e5cf40a5b4d6f89e96019382?sid=e3fbdcac-90a0-4b7c-bc09-bdcc0b3fbc71").


### Use Control-Panel

```ts
import { getLoginOrRegistrationPayload } from '@frequency-control-panel/utils';

const signInResponse: ControlPanelResponse = await getLoginOrRegistrationPayload();
```

There two response types: 'sign-up' and 'sign-in', depending on whether a user attempting to sign-in has a Frequency account or has gone through the Sign-up or Sign-in flow.

## Sign-up
When the result is a sign-up the payload looks as follows:
```ts
{
  type: "sign-up",
  encodedClaimHandle: "0xb9010442006200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce8030162d5620f3b20f2cef57106578ec22461b0d2c14eae35f6f0fa429d95e62bc8412793eaf0109f89aac2daf46d13a1955d108ec2cbf0ce0b3c5605c0da6258228314656e64647932000000",
  encodedCreateSponsoredAccountWithDelegation: "0xed01043c016200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301e06090ff423adda2110eb5568b3871dff60e2cc44f822a162a99435dac5a4848d448bee8321ce2e8335641d2c2f7c8cfd9b813d3fccc928681028aba2f7fbd820100000000000000140000000000000000000032000000"
}
```
Encoded transactions are provided for `CreateSponsoredAccountWithDelegation` and `ClaimHandle` to ease submitting transaction to chain.

It is recommended to check the validity of the encoded payload as well as to keep track of the expiration of the grant delegation. This helps with avoiding failed transactions due to expiration of signature for granting delegation. Methods for decoding a hex-encoded extrinsic can be found in the [Polkadot documentation](https://wiki.polkadot.network/docs/build-transaction-construction).

When the result is a sign-in the payload looks as follows:
```ts
{
    type: 'sign-in',
    message: "localhost wants you to sign in with your Frequency account:\n5EHCkT3rPBMrCabta778SiUVvNhYfG8BJ8Cfp5iFsNxvMTCg\n\nThe domain localhost wants you to sign in with your Frequency account via localhost\n\nURI: http://localhost:5173/signin/confirm\nNonce: 5bUfb4eICXTE23KlW\nIssued At: 2024-02-29T14:29:50.487Z\nExpiration Time: 2024-02-29T14:34:50.487Z",
    signature: "0x04332c86bf4e429d4fce6c11186813082a8adfa7c73f0a9ce4a34e1154ca0c4c2eb1684ee8f578d5ebb7b22f9181eac0551932ebe7926ad5f13893e030627687"
}
```
This mean that a user has an MSA account and is a returning user to an application. This user has already granted delegation.

At this point, it is up to you to create a session following best practices.

References for validation are live inside [example-app](https://github.com/AmplicaLabs/frequency-control-panel/tree/main/packages/apps/example/src/lib/components/SignInVerification.svelte)