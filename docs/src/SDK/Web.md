# Web SIWF SDK

## Quick Reference

- [SIWF Web SDK Source Code + Example](https://github.com/ProjectLibertyLabs/siwf/tree/main/libraries/sdk-web#readme)
- [NPM Package: `@projectlibertylabs/siwf-sdk-web`](https://www.npmjs.com/package/@projectlibertylabs/siwf-sdk-web)
- [jsDelivr: `https://cdn.jsdelivr.net/npm/@projectlibertylabs/siwf-sdk-web@1.0.1/siwf-sdk-web.min.js`](https://www.jsdelivr.com/package/npm/@projectlibertylabs/siwf-sdk-web)

## 1. Installation

Simply include the SDK in your HTML from [jsDelivr](https://www.jsdelivr.com/package/npm/@projectlibertylabs/siwf-sdk-web) (update the version as needed):

```html
<script src="https://cdn.jsdelivr.net/npm/@projectlibertylabs/siwf-sdk-web@1.0.1/siwf-sdk-web.min.js"></script>
```

Or download from [GitHub Releases](https://github.com/ProjectLibertyLabs/siwf/releases?q=sdk-web&expanded=true) and include it locally:

```html
<script src="path/to/siwf-sdk-web.min.js"></script>
```

## 2. Displaying the SIWF Button

To create a SIWF Button, use the `Siwf.createSignInButton` method:

```html
<!-- Add a button container with data attributes -->
<div data-siwf-button="YOUR_ENCODED_SIGNED_REQUEST" data-siwf-mode="primary" data-siwf-endpoint="mainnet"></div>
```

`data-siwf-button` requires the [Signed Request Payload](../Actions/Start.html#step-1-generate-the-signed-request-payload) in `base64url` encoded form.

You can also use a [JavaScript render call](https://github.com/ProjectLibertyLabs/siwf/tree/main/libraries/sdk-web#option-b-javascript-implementation).

## 3. Handling Authorization Callbacks

You will need to handle the callback URL specified and extract the `authorizationCode` parameter from the callback and passing it to your backend service.

## 4. Process Authorization Code

On your backend service, process the authorization code and start your session.

Resources:
- [Documentation on Processing a Result](../Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
