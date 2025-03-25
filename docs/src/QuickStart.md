# Quick Start with JavaScript

This quick start uses the `@projectlibertylabs/siwf` NPM package to quickly generate the request and validate the response from Frequency Access.

## Installation

Install the NPM package.
This package is both CommonJS, ES Module, and TypeScript compatible.
TypeScript will be shown for the examples.

`npm i @projectlibertylabs/siwf`

## Prerequisites

- Generate a [Login Request Payload and Signature](./Generate.md)

## Step 1: Generate the Request URL

```typescript
import * as siwf from "@projectlibertylabs/siwf";

async function startLogin() {
  // Get the signed base64url encoded payload
  const signedRequest: string = getStaticProviderSignedRequest();

  // Any additional parameters that do not collide with reserved parameter names
  // on the Authentication URL are passed through unchanged.
  // Remember that ONLY the callback path from the Signed Payload is secured via signature.
  const additionalCallbackUrlParams: string = getWebOrApplicationCallbackUrlParams();

  // Options with endpoint selection
  // Endpoint may be tagged or specified in full
  const options = { endpoint: "production" };
  // Staging-Testnet Options
  // const options = { endpoint: 'staging' };

  const authenticationUrl = siwf.generateAuthenticationUrl(signedRequest, additionalCallbackUrlParams, options);
}
```

## Step 2 (Web): Forward the User to a Browser

For website interactions, just forward the user to the returned `authenticationUrl`.

## Step 2 (Android/iOS): Forward the User to an Embedded Browser

[SDKs are provided](/SDK/Overview.md) for Android and iOS to perform the correct redirects and callback setups using the proper interactions specific to these platforms.

## Step 3: Callback Processing

```typescript
import * as siwf from "@projectlibertylabs/siwf";

async function handleCallback(incomingUrl: string) {
  // Extract the `authorizationCode` from the URL
  const url = new URL(incomingUrl);
  const authorizationCode = url.searchParams.get("authorizationCode");

  // Same options as before
  const options = { endpoint: "production" };

  // Exchange the `authorizationCode` for the result
  const result = await siwf.getLoginResult(authorizationCode, options);

  if (siwf.hasChainSubmissions(result)) {
    // Add your own logic for handling the submission to the chain
    await processSubmissions(result.payloads);
  }

  if (result.credentials) {
    // Add your own logic for processing credentials
    await processCredentials(result.credentials);
  }

  // Get the ss58 encoded key that identifies this session
  // It is also the control key for the user's constant MSA Id
  const userKey = result.userPublicKey.encodedValue;

  // Add your own logic for session managment
  startSession();
}
```

## Step 4: Session Starts

You now have a logged in user!
Assuming the chain submissions are complete, you also have:

- A consistent identifier, i.e. the MSA Id
- A universal handle (If the user set one)
- A public delegation between the user's MSA Id and your Provider Id on chain (revokable at any time by you or the user independently)

And if requested:

- Access to the user's private graph
- Permission to act on the user's behalf for delegated actions
- Verified email or phone/SMS number for the user

<div class="warning">
Note: You may start the user’s session and process the submissions in the background, however some data such as the consistent identifier, the MSA Id or full handle with suffix may not be accessible until the processing is complete.
</div>
