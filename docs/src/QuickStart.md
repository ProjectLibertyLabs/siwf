# Quick Start with JavaScript

This quick start uses the `@projectlibertylabs/siwa` NPM package to quickly generate the request and validate the response from Frequency Access.

## Installation

Install the NPM package.
This package is both CommonJS, ES Module, and TypeScript compatible.
TypeScript will be shown for the examples.

`npm i @projectlibertylabs/siwa`

## Prerequisites

- Generate a [Login Request Payload and Signature](./Generate.md)

## Step 1: Generate the Request URL

```typescript
import * as siwa from "@projectlibertylabs/siwa";

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

  const authenticationUrl = siwa.generateAuthenticationUrl(signedRequest, additionalCallbackUrlParams, options);
}
```

## Step 2 (Web): Forward the User to a Browser

For website interactions, just forward the user to the returned `authenticationUrl`.

## Step 2 (Android/iOS): Forward the User to an Embedded Browser

For mobile applications, it is recommended to use an embedded browser and set the `callbackDomain` in the `signedRequest` and the `callbackPath` to your application's Universal Link. This ensures that the user remains within the application environment and does not have to leave the app.

For more details, refer to the official documentation:

- [SafariViewController for iOS](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller)
- [Chrome Custom Tabs for Android](https://developer.chrome.com/docs/android/custom-tabs/)

## Step 3: Callback Processing

```typescript
import * as siwa from "@projectlibertylabs/siwa";

async function handleCallback(incomingUrl: string) {
  // Extract the `authorizationCode` from the URL
  const url = new URL(incomingUrl);
  const authorizationCode = url.searchParams.get("authorizationCode");

  // Same options as before
  const options = { endpoint: "production" };

  // Exchange the `authorizationCode` for the result
  const result = await siwa.getLoginResult(authorizationCode, options);

  if (siwa.hasChainSubmissions(result)) {
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
