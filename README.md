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

## Getting Started

### Development Setup

Install [pnpm](https://pnpm.io/installation) Start-up local-chain
[Frequency](https://hub.docker.com/r/dsnp/instant-seal-node-with-deployed-schemas/tags)

```
pnpm install
```

#### Terminal 1

```
cd ./packages/apps/frequency-wallet-proxy
```

```
pnpm dev
```

#### Terminal 2

```
cd ./packages/apps/example
```

```
pnpm dev
```

Both example application and control-panel should look like this after starting [demo video](https://www.loom.com/share/63551846e5cf40a5b4d6f89e96019382?sid=e3fbdcac-90a0-4b7c-bc09-bdcc0b3fbc71).

## Usage
Import the `setConfig` and `getLoginOrRegistrationPayload` functions. `setConfig` is used to set the URL to Frequency-Control-Panel.

The current deployed environment is via GitHub pages at:

```
https://amplicalabs.github.io/frequency-control-panel/wallet-proxy
```

For development this can be replaced with the address the application runs on.


```ts
  import {
    type ControlPanelResponse,
    getLoginOrRegistrationPayload,
    setConfig,
  } from '@frequency-control-panel/utils';
   setConfig({
      // Your providerId
      providerId: '1',
      // The url where Wallet-Proxy lives
      proxyUrl: "https://amplicalabs.github.io/frequency-control-panel/wallet-proxy",
      // The Frequency RPC endpoint
      frequencyRpcUrl: "https://rpc.rococo.frequency.xyz",
      siwsOptions: {
        // The expiration for the SIWS payload.
        expiresInMsecs: 1000,
      },
      // The Schema name that permissions are being requested.
      // A specified version can be set using the ID attribute.
      // If set to 0 it grabs the latest version for the schema.
      schemas: [
        {name: 'public-key-key-agreement'},
        {name: 'public-follows'},
        {name: 'private-follows'},
        {name: 'private-connections'}
      ],
    });
```
A list for all the schemas DSNP supports can found [here](https://spec.dsnp.org/Frequency/Overview.html?highlight=schema#dsnp-over-frequency-schemas).

```html
<script>
async function handleSignInClick() {
    const payload = await getLoginOrRegistrationPayload();
}
</script>

<button onclick="handleSignInClick()">Get Login/Signup</button>

```

The response from `getLoginOrRegistrationPayload`

```ts
export type WalletProxyResponse = {
  signIn?: SignInResponse;
  signUp?: SignUpResponse;
};
```

## Handling Responses
The response from the Wallet-Proxy during sign-in may vary slightly because it's uncertain whether the user is attempting to sign in with a social identity (MSA), is a returning user to the dApp, or requires permission grants.

### Brand new user
In this scenario, the response indicates that the user does not possess a social identity account (MSA) and has authorized the dApp to create one for them. This process involves assigning a unique user handle that will be linked to the new MSA account after submitting transactions to Frequency.

The returned payload includes two encoded transactions (extrinsics) with signatures. One transaction creates a new MSA and grants the dApp the authority to act on the user's behalf (delegation), along with a specific set of permissions (schema permissions). The other transaction carries a signature that approves the claiming of a user handle for the account.

```json
{
  "signUp": {
    "extrinsics": [
      {
        "pallet": "msa",
        "extrinsicName": "createSponsoredAccountWithDelegation",
        "encodedExtrinsic": "0xed01043c01b01b4dcafc8a8e73bff98e7558249f53cd0e0e64fa6b8f0159f0913d4874d9360176644186458bad3b00bbd0ac21e6c9bd5a8bed9ced7a772d11a9aac025b47f6559468808e272696f596a02af230951861027c0dc30f7163ecf316838a0723483010000000000000014000000000000000000004d000000"
      },
      {
        "pallet": "handles",
        "extrinsicName": "claimHandle",
        "encodedExtrinsic": "0xb901044200b01b4dcafc8a8e73bff98e7558249f53cd0e0e64fa6b8f0159f0913d4874d93601225508ae2da9804c60660a150277eb32b2a0f6b9c8f6e07dd6cad799cb31ae1dfb43896f488e9c0b7ec8b530d930b3f9b690683f2765d5def3fee3fc6540d58714656e6464794d000000"
      }
    ]
  }
}
```

### Authorizes app as a delegate
This response means that an user already has an MSA. However, the user is new to this application is therefore allowing the application to be added as a delegate, with permissions to the schemas requested by the application.

This response may also indicate that the user has an active delegation to the requesting application, but the application is requesting additional schema permissions beyond what the user had previously authorized.

```json
{
  "signUp": {
    "extrinsics": [
      {
        "pallet": "msa",
        "extrinsicName": "grantDelegation",
        "encodedExtrinsic": "0xc501043c03a028a10adc58e0e85c9f604e4b7c1cfe467ea25553b1fd5f19eac25a71d46d770164d9ba24677e28555d98fad2865b069fb0d51f2f45b0e86098dec272e0a5013699d17d9c86ea2c96d0e3e7a3952db232d57b1973d41fbdffcd35bdc78e21a88e0100000000000000004e000000"
      }
    ]
  },
  "signIn": {
    "siwsPayload": {
      "message": "localhost wants you to sign in with your Frequency account:\n5Fghb4Wt3sg9cF6Q2Qucp5jXV5pL2U9uaYXwR9R8W8SYe9np\n\nThe domain localhost wants you to sign in with your Frequency account via localhost\n\nURI: http://localhost:5173/signin/confirm\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: 2024-03-05T23:18:03.041Z\nExpiration Time: 2024-03-05T23:23:03.041Z",
      "signature": "0x38faa2fc6f59bef8ffccfc929fb966e1d53ba45e3af7a029ea1d636eaddcbe78a4be0f89eaf7ff7bbaef20a070ad65f9d0f876889686687ef623214fddddb18b"
    }
  }
}

```

### Returning User
This mean that a user has an MSA account and is a returning user to an application. This user has already granted delegation and schemas permissions and is simply signing in.

```json
{
 "signIn": {
    "siwsPayload": {
      "message": "localhost wants you to sign in with your Frequency account:\n5Fghb4Wt3sg9cF6Q2Qucp5jXV5pL2U9uaYXwR9R8W8SYe9np\n\nThe domain localhost wants you to sign in with your Frequency account via localhost\n\nURI: http://localhost:5173/signin/confirm\nNonce: N6rLwqyz34oUxJEXJ\nIssued At: 2024-03-05T23:18:03.041Z\nExpiration Time: 2024-03-05T23:23:03.041Z",
      "signature": "0x38faa2fc6f59bef8ffccfc929fb966e1d53ba45e3af7a029ea1d636eaddcbe78a4be0f89eaf7ff7bbaef20a070ad65f9d0f876889686687ef623214fddddb18b"
    }
  }
}
```

### User manually closes window before
An empty payload means that a user has closed the popup window before completing the sign in flow.
```
{}
```
### Validating Response
It is recommended to check the validity of the encoded payload as well as to keep track of the expiration of the grant delegation. This helps with avoiding failed transactions due to expiration of signature for granting delegation. Methods for decoding a hex-encoded extrinsic can be found in the [Polkadot documentation](https://wiki.polkadot.network/docs/build-transaction-construction).


The `validateSignupExtrinsicsParams` function performs validation on signup extrinsic parameters to ensure the integrity and correctness of the signup process. It verifies several critical aspects of the provided extrinsics, including the validity and expiration of proofs, the consistency of signing keys, the format of encoded data, and the matching of permissions with the provider's MSA ID.

### Parameters
`extrinsics`: An array of objects, each representing a signup extrinsic. Each extrinsic object includes:
- `pallet`: The name of the pallet.
- `extrinsicName`: The name of the extrinsic call.
- `encodedExtrinsic`: The hex-encoded extrinsic data.
- `providerMsaId`: The MSA ID of the provider. This ID is used to validate that permissions were granted by the correct provider.

### Return Value
The function returns a Promise that resolves to an object containing the following properties:

- `expiration`: The expiration timestamp of the proof.
- `payloads`: An object containing details of the payloads, such as addProviderPayload and claimHandlePayload, depending on the extrinsics provided.
- `publicKey`: The public key used for signing the payloads.
- `calls`: The list of extrinsic calls in the order that they should be submitted on-chain.

### Example Usage
```ts
let response = {
  "signUp": {
    "extrinsics": [
      {
        "pallet": "msa",
        "extrinsicName": "grantDelegation",
        "encodedExtrinsic": "0xc501043c03a028a10adc58e0e85c9f604e4b7c1cfe467ea25553b1fd5f19eac25a71d46d770164d9ba24677e28555d98fad2865b069fb0d51f2f45b0e86098dec272e0a5013699d17d9c86ea2c96d0e3e7a3952db232d57b1973d41fbdffcd35bdc78e21a88e0100000000000000004e000000"
      },
    ]
  }
};

  const providerMsaId = 1;

  const {
    expiration,
    payloads: { addProviderPayload, claimHandlePayload },
    publicKey,
    calls,
  } = await validateSignupExtrinsicsParams(response.signUp.extrinsics, providerMsaId)
```
### Errors
The function may throw errors of type SignupError for various failure scenarios. Possible errors include:

- `InvalidSignature`: The signature provided in the extrinsic is invalid.
- `ExpiredSignature`: The signature associated with the transaction has expired.
- `UnsupportedExtrinsic`: The extrinsic call provided is not supported.
- `InvalidMsaId`: The MSA ID provided does not match any valid ID in the system.
- `SignupKeysMismatch`: The keys used to sign the signup payloads do not match.
- `InvalidHex`: The extrinsic data is not properly hex-encoded.
- `ApiNotReady`: The API is not ready to process the request.

```ts
export enum SignupError {
  InvalidSignature = 'Invalid signature',
  ExpiredSignature = 'Transaction signature is expired',
  UnsupportedExtrinsic = 'Unsupported extrinsic call',
  InvalidMsaId = 'Invalid MSA ID',
  SignupKeysMismatch = 'Signing keys do not match',
  InvalidHex = 'Expected hex-encoded call',
  ApiNotReady = 'API is not ready',
}
```

At this point, it is up to you to create a session following best practices.

References for validation are live inside [example-app](https://github.com/AmplicaLabs/frequency-control-panel/tree/main/packages/apps/example/src/lib/components/SignInVerification.svelte)