# Signed Request for Authentication URL Signature

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

### Parameter: `userIdentifierAdminUrl`

Only used for custom integration situations.

## Step 2: Signing the Request

To ensure that the correct application is requesting the authentication and that the response is only sent to the authorized party, the request is signed.
The signature MUST be from one of the [Control Keys](https://docs.frequency.xyz/Identity/ControlKeys.html) of the Frequency Provider.

### 2a: Serialize the payload using the [SCALE Codec](https://docs.substrate.io/reference/scale-codec/)

SCALE Type (Note: Order matters!)

```json
{
  "callback": "String",
  "permissions": "Vec<U16>",
  "userIdentifierAdminUrl": "Option<String>",
}
```

### 2b: Wrap the Payload

So that no payloads can be accidentally used on a chain, the payload is wrapped with a `<Bytes>` tag.

Byte Arrays Concatenated: `[ 60, 66, 121, 116, 101, 115, 62 ] + scale_encoded_payload_bytes + [ 60, 47, 66, 121, 116, 101, 115, 62 ]`

### 2c: Sign the Wrapped Payload Bytes

Sign the serialized payload using Schnorr signatures over ECDSA.

### 2d: Example

#### Sr25519
Remember that SR25519 signatures are non-deterministic, so the payload and encoding will match, but the signature will be different.
This example uses the `//Alice` seed phrase to generate the signature.

- Payload: `{ "callback": "https://localhost:44181", "permissions": [5, 7, 8, 9, 10] }`
- SCALE Payload (Hex): `0x5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a0000`
- Wrapped Payload (Hex): `0x3c42797465733e5c68747470733a2f2f6c6f63616c686f73743a34343138311405000700080009000a00003c2f42797465733e`
- Signing Public Key (SS58 Prefix 90): `f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH`
- Signature (Hex): `0x9abd3c54e7164e8385627dc692724b9467386acd7b02a13d6187e2c58fd91440d9134781c0410a45812f5532b71f4a34b4a5443ef8d68b5a1956f7f0f81d4286`

#### Secp256k1
This example uses the `0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133` private key.

- Payload: `{ "callback": "http://localhost:3000", "permissions": [5, 7, 8, 9, 10] }`
- Signing Ethereum Address: `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
- Signature (Hex): `0x8248785b609da7f257667c55ac6cbf78f2b5d42aa63334950fbaa33cf6c719d6010b23d179819461287a67edc3d420b048fb69d0cb06247382adb5b412ebed1b1c`

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

## Step 4 (Recommended): Provide Application Context

To help users understand which application is asking them to sign in, you can provide an `applicationContext` object that contains the URL of an application context credential.
This is especially important if you want to manage multiple applications under a single provider identity.
Note that any delegations that are granted by the user will apply to all applications for that provider.

```json
{
  // ...
  "applicationContext": {
    "url": "https://example.org/myapp/siwf-manifest.json"
  }
}
```

The application context credential is a JSON-formatted verifiable credential that MAY be signed by a credential issuer.
If you are integrating with Frequency Access, your application context details will be created as part of the provisioning process.

For detailed information on the credential schema and properties, see the [full specification and example](./DataStructures/All.html#application-context).

### Example Using TypeScript/JavaScript

```typescript
// This is the URI of a key. Usually just a seed phrase, but also supports test accounts such as `//Alice` or `//Bob`
const providerKeyUri: string = getProviderKeyUriSecret();

// The list of Frequency Schemas Ids that you are requesting the user delegate
// See a full reference: https://projectlibertylabs.github.io/siwf/v2/docs/Delegations.html
// This example is for Graph Only
const permissions: number[] = [7, 8, 9, 10];

// List of Credentials
// See a full reference and examples: https://projectlibertylabs.github.io/siwf/v2/docs/Credentials.html
const credentials = [
  {
    anyOf: [siwf.VerifiedEmailAddressCredential, siwf.VerifiedPhoneNumberCredential],
  },
  siwf.VerifiedGraphKeyCredential,
];

// This is a reference to an application context credential
const applicationContext = {
  url: "https://example.org/myapp/context.json",
};

// This is the URI that the user should return to after authenticating
const callbackUri: string = getWebOrApplicationCallbackUri();

// The Encoded Signed Request can remain static if
// It is the same as is generated with the Signed Payload Generation Tool
const encodedSignedRequest = await siwf.generateEncodedSignedRequest(
  providerKeyUri,
  callbackUri,
  permissions,
  credentials,
  applicationContext,
);

// Options with endpoint selection
// Endpoint may be tagged or specified in full
const options = { endpoint: "production" };
// Staging-Testnet Options
// const options = { endpoint: 'staging' };

const authenticationUrl: string = generateAuthenticationUrl(signedRequest, new URLSearchParams({ id: getSessionId() }));
```

### Full Example Request

#### Sr25519
{{#include DataStructures/Sr25519/SignedRequest.md 0}}

#### Secp256k1
{{#include DataStructures/Secp256k1/SignedRequest.md 0}}

## Usage

See [Start](./Actions/Start.md) for details on how to use the generated signature.

### Serialization

1. JSON Stringify the `SignedRequest` object
2. [`base64url`](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encode the stringified result
