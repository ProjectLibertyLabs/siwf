# Redirect User to Frequency Access

To start the authentication loop, your application will generate an Authentication URL for each user.

## Quick Reference

- Staging-Testnet: `https://testnet.frequencyaccess.com/siwa/start`
- Production-Mainnet: `https://www.frequencyaccess.com/siwa/start`
- Generate Login Request Payload and Signature: [Generator Tool](../Generate.md)
- Request Structure: [`SiwaRequest`](../DataStructures/All.md#request)
- Signed Request Structure: [`SiwaSignedRequest`](../DataStructures/All.md#signed-request)

## Step 1: Generate the Signed Request Payload

You *can* generate more than one of these to use simultaneously.
Most applications should generate and keep their needed value(s) static.
The generated signed request payload is secured by the signature included in it, and it is not sensitive data.

### Signed Request Payload Contents

- A signature from one of the [Control Keys](https://docs.frequency.xyz/Identity/ControlKeys.html) of the Frequency Provider
- The domain and path the callback will use
- The requested permissions
- The requested credentials

### Signed Request Payload Generator

Generate one or more login request payloads and signatures (`signedRequest`) using the [Generator Tool](../Generate.md).

### Signed Request Payload Detailed Documentation

For details on the Payload and how it is formed, see the [Reference Documentation](../SignatureGeneration.md).

## Step 2: Build the Authentication URL Parameters

### Parameter: `signedRequest`

The [Base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoded value from Step 1.

Reminder: This includes the callback domain that will be used.

### Additional Parameters are Forwarded

Any additional parameters that do not collide with reserved parameter names on the Authentication URL are passed through unchanged.

<div class="warning">
Note: These parameters are not protected and could be changed by malicious actors.
Take care when using them for security-related data.
</div>

#### Example

- `https://www.frequencyaccess.com/siwa/start?signedRequest=<request value>&key1=<value1>&key2=<value2>&other=<result>`
- Will result in callback URL parameters of: `?authorizationCode=<authorization code>&key1=<value1>&key2=<value2>&other=<result>`

## Step 3: Build the Authentication URL

Taking the parameters from the previous step, build an Authentication URL using the correct base:

- Staging-Testnet: `https://testnet.frequencyaccess.com/siwa/start`
- Production-Mainnet: `https://www.frequencyaccess.com/siwa/start`

Frequency Access will send the user back by building the callback URL.
The callback URL will be built with:

- The callback from the `signedRequest`
- Appending any additional GET request parameters
- Appending the reserved URL parameter of `authorizationCode`

The callback URL _will maintain_ all non-reserved URL parameters.
For example, if you wish to correlate the original unauthorized session with the authorized session, you can generate a dynamic parameter with a random UUIDv4 identifier on each request.

### Example

Parameters

{{#markdown-embed src/DataStructures/Request.md 0}}

Testnet Authentication URL

{{#markdown-embed src/DataStructures/RequestUrl.md 0}}

## Step 3: Redirect the User

- Redirect the user's Browser or Embedded Browser (for mobile apps) to the Authentication URL.
  - [SafariViewController for iOS](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller)
  - [Chrome Custom Tabs for Android](https://developer.chrome.com/docs/android/custom-tabs/)
