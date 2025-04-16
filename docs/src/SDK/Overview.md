# Sign In With Frequency (SIWF) SDK Integration Guide

The SIWF SDK provides a seamless authentication experience for your applications.
These guides will walk you through integrating the SIWF SDK into your **iOS** or **Android** app.

### Platform-Specific SDK Guides

- [Android](Android.md)
- [iOS](iOS.md)
- [Web](Web.md)

---

## General Overview

### 1. Installation

Add the platform-specific package to your project.

### 2. Displaying the SIWF Button

SIWF Button creation will require the [Signed Request Payload](../Actions/Start.html#step-1-generate-the-signed-request-payload) in either `base64url` encoded or structured form.
You may also specify other options such as the button style (light/dark) and the network (Mainnet/Testnet) to use.

### 3. Handling Authorization Callbacks

You will need to create a redirect handler to receive information from the Authorization (i.e. the redirect URL provided to the Signed Request Payload).
This redirect handler will receive information once the authorization is complete, which may then be sent and processed by your system’s backend to initiate the session.

See platform-specific details in the [Android](Android.md) or [iOS](iOS.md) sections for instructions for creating the callback handler.
[Web](Web.md) requires your own callback processing to extract the `authorizationCode` from the URL parameters.

### 4. Process Authorization Code

On your backend service, process the authorization code and start your session.
The [Frequency Gateway Account Service](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html) supports directing sending the result from the authorization process for processing.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
