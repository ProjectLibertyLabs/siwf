# Sign In With Frequency (SIWF) SDK Integration Guide

The SIWF SDK provides a seamless authentication experience for your applications.
These guides will walk you through integrating the SIWF SDK into your **iOS** or **Android** app.

### Platform-Specific SDK Guides

- [Android](Android.md)
- [iOS](iOS.md)

---

## General Overview

### 1. Installation

Add the platform-specific package to your project.

### 2. Displaying the SIWF Button

SIWF Button creation will require the [Signed Request Payload](../Actions/Start.html#step-1-generate-the-signed-request-payload) in either `base64url` encoded or structured form.
You may also specify other options such as the button style (light/dark) and the network (Mainnet/Testnet) to use.

### 3. Handling Authorization Callbacks

You will need to create a redirect handler to receive the information from the Authorization.
This is the redirect URL provided to the Signed Request Payload.
That handler will receive the information Once the authorization is complete that can then be send and processed by your backend and initate the session.

See the platform specific details for how to create the callback handler.

### 4. Process Authorization Code

On your backend service, process the authorization code and start your session.
The [Frequency Gateway Account Service](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html) supports directing sending the result from the authorization process for processing.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
