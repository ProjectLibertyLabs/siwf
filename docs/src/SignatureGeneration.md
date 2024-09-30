# Authentication URL Signature

Most applications skip all of this and just [generate the login request payload and signature](./Generate.md).

## Step 1: Create the Payload for Signing

### Parameter: `callback`

When the user has completed the authentication, this is the return URI that will be used.

Appended to the URL will be this parameter:

- `authorizationCode` Used to retrieve the full response payload

The callback url _will maintain_ any other URL parameters included.
For example, if you wish to correlate the original unauthorized session with the authorized session, you can generate a dynamic callback url with a parameter with a random UUIDv4 identifier on each request.

### Parameter: `permissions`

The list of Frequency Schema Ids permissions your application is requesting from the user.

- See a full list of [Available Delegations](./Delegations.md)

## Step 2: Signing the Request

To ensure that the correct application is requesting the authentication and that the response is only sent to the authorized party, the request is signed.
The signature MUST be from one of the [Control Keys](https://docs.frequency.xyz/Identity/ControlKeys.html) of the Frequency Provider.

### 2a: Serialize the payload using the [SCALE Codec](https://docs.substrate.io/reference/scale-codec/)

SCALE Type (Note: Order matters!)

```json
{
  "callback": "String",
  "permissions": "Vec<U16>"
}
```

### 2b: Wrap the Payload

So that no payloads can be accidentally used on a chain, the payload is wrapped with a `<Bytes>` tag.

Byte Arrays Concatenated: `[ 60, 66, 121, 116, 101, 115, 62 ] + scale_encoded_payload_bytes + [ 60, 47, 66, 121, 116, 101, 115, 62 ]`

### 2c: Sign the Wrapped Payload Bytes

Sign the serialized payload using Schnorr signatures over ECDSA.

### 2d: Example

Remember that Sr25519 signatures are non-deterministic, so the payload and encoding will match, but the signature will be different.
This example uses the `//Alice` seed phrase to generate the signature.

- Payload: `{ "callback": "https://localhost:44181", "permissions": [5, 7, 8, 9, 10] }`
- SCALE Payload (Hex): `0x5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a00`
- Wrapped Payload (Hex): `0x3c42797465733e5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a003c2f42797465733e`
- Signing Public Key (SS58 Prefix 90): `f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH`
- Signature (Hex): `0x446c32dd524c1f4b06c213891e9e3a025dded43eae55d2df40a766187684ac2704434e1835573077c1abb783b98f3684488e41f8c9bdc359458f9e043ae5cd86`

## Step 3 (Optional): Request Credentials (Graph Key, Email, Phone)

Frequency Access users can provide verified email or phone/SMS to your application when requested and approved by the user.
This is _not_ required, and best practice is to only make such a request if it is required for the functioning of the application.

The request MUST be wrapped in `requestedCredentials` which is an array that requires ALL listed credential objects.
Supported Options:

- `anyOf`: Request for one or more credentials from the list (0+ may return)

```json
{
  // ...
  "requestedCredentials": [
    {
      "type": "VerifiedGraphKeyCredential",
      "hash": ["bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y"]
    }
    {
      "anyOf": [
        // List of contact credential requests here
        {
          "type": "VerifiedEmailAddressCredential",
          "hash": ["bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi"]
        },
        {
          "type": "VerifiedPhoneNumberCredential",
          "hash": ["bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq"]
        }
      ]
    }
  ]
}
```

- See a full list of [Available Credentials](./Credentials.md)

### Example Using TypeScript/JavaScript

```typescript
// This is the URI of a key. Usually just a seed phrase, but also supports test accounts such as `//Alice` or `//Bob`
const providerKeyUri: string = getProviderKeyUriSecret();

// The list of Frequency Schemas Ids that you are requesting the user delegate
// See a full reference: https://projectlibertylabs.github.io/siwa/Delegations.html
// This example is for Graph Only
const permissions: number[] = [7, 8, 9, 10];

// List of Credentials
// See a full reference and examples: https://projectlibertylabs.github.io/siwa/Credentials.html
const credentials = [
  {
    anyOf: [siwa.VerifiedEmailAddressCredential, siwa.VerifiedPhoneNumberCredential],
  },
  siwa.VerifiedGraphKeyCredential,
];

// This is the URI that the user should return to after authenticating with Frequency Access
const callbackUri: string = getWebOrApplicationCallbackUri();

// The Encoded Signed Request can remain static if
// It is the same as is generated with the Signed Payload Generation Tool
const encodedSignedRequest = await siwa.generateEncodedSignedRequest(
  providerKeyUri,
  callbackUri,
  permissions,
  credentials,
);

// Options with endpoint selection
// Endpoint may be tagged or specified in full
const options = { endpoint: "production" };
// Staging-Testnet Options
// const options = { endpoint: 'staging' };

const authenticationUrl: string = generateAuthenticationUrl(signedRequest, new URLSearchParams({ id: getSessionId() }));
```

### Full Example Request

{{#markdown-embed src/DataStructures/SignedRequest.md 0}}

## Usage

See [Start](./Actions/Start.md) for details on how to use the generated signature.

### Serialization

1. JSON Stringify the `SignedRequest` object
2. [`base64url`](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encode the stringified result
