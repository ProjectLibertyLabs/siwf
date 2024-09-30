# Getting the Login Result from Frequency Access

After the user completes the authentication and authorization, the user is redirected to the callback URL with one additional parameter set: `authorizationCode`.

The `authorizationCode` can be used to retrieve the result of the login.

## Step 1: Retrieve the Response

- `GET`:
  - Staging-Testnet: `https://testnet.frequencyaccess.com/siwa/api/payload?authorizationCode=[Parameter from callback URL]`
  - Production-Mainnet: `https://www.frequencyaccess.com/siwa/api/payload?authorizationCode=[Parameter from callback URL]`

## Step 2: Parsing the Response

Response Sections

- `userPublicKey`: The key for the user signing this request
- `payloads`: Signed payloads from the user
- `credentials`: User approved verified credentials from Frequency Access such as email, phone, user keys, etc...

### `userPublicKey`

The public key for the user identifies the user for this session.
If that user has a Frequency blockchain account (MSA), the MSA Id can be retrieved from Frequency using this key.
Or in the case when it does not, the `payloads` section will contain the payload to create said MSA Id.

While the `userPublicKey` may change, the MSA Id will _always_ be the same for the same user account.

## Step 3: Processing the Credentials

The `credentials` array will contain any [requested](../SignatureGeneration.md#step-3-optional-request-credentials-graph-key-email-phone) and approved credentials.
Each credential would be matched based on the `type` field.

These credentials follow the [DSNP Verifiable Credentials Specification](https://spec.dsnp.org/VerifiableCredentials/Overview.html).

- [`@dsnp/verifiable-credentials`](https://github.com/LibertyDSNP/dsnp-verifiable-credentials) TypeScript library for verifying these DSNP Credentials specifically
- Other [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model-1.1/) verifiers may also be compatable.

### Verify the Credential

_Trust Model Note_: You may choose to just trust credentials issued by Frequency Access given that the credential is fetched directly from Frequency Access. These will have issuer `did:web:testnet.frequencyaccess.com` or `did:web:frequencyaccess.com`.

1. Check that the `credentialSubject.id` matches the `userPublicKey` following the [`did:key` Method from the W3C](https://w3c-ccg.github.io/did-method-key/#format)
  - Example: `f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH` is the [SS58](https://docs.substrate.io/reference/address-formats/) version with prefix `90` of the hex address `0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d`. `0xef01d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d` is multicodec `sr25519-pub` hex which is multiformat `base58-btc` `z6QNzHod3tSSJbwo4e5xGDcnsndsR9WByZzPoCGdbv3sv1jJ`
2. Fetch the issuer DID Document following the [`did:web` Method from the W3C](https://w3c-ccg.github.io/did-method-web/)
  - Production-Mainnet should always be `did:web:frequencyaccess.com` which resolves to `https://frequencyaccess.com/.well-known/did.json`
  - Staging-Testnet should always be `did:web:testnet.frequencyaccess.com` which resolves to `https://testnet.frequencyaccess.com/.well-known/did.json`
3. Check that the key in the `proof.verificationMethod` is in the DID Document to verify that the key is still valid
4. Test that the `proof` validates according the to [W3C Verifiable Credentials Specification](https://www.w3.org/TR/vc-data-model-1.1/#verification)


## Graph Encryption Key Credential

If the user has permitted access to their private social graph per the request for `VerifiedGraphKeyPairCredential`, `credentials` will have a entry with `type` including `VerifiedGraphKeyPairCredential`.
This is an `x25519` key pair for use with the `curve25519xsalsa20poly1305` encryption algorithm from the [NaCl Library](http://nacl.cr.yp.to).
For more information on how the Graph data is structured after decryption, see the [DSNP Specification](https://spec.dsnp.org/DSNP/UserData.html).

This key pair is PII and should be stored with care, but must be stored to read the user's private graph.

### Example Credential

{{#markdown-embed src/DataStructures/VerifiedPhone.md 0}}

## Step 4: Processing the Payloads

The payload section has several different types that can be returned:

- `login`: When the user already has a correct delegation
- `addProvider`*: When the user does not have a delegation (a new user signup) or when the delegation was needing to be changed
- `itemActions`*: When the user has user chain data to set or update
- `claimHandle`*: When the user needs to claim a new handle

\* Requires submission to Frequency

The payloads that require submission to Frequency should be submitted in one batch using [Capacity](https://docs.frequency.xyz/Tokenomics/ProviderIncentives.html#capacity-model).
The `addProvider` *must* always be *first* in the batch to ensure the correct permissions and delegations are in place for subsequent actions in the batch.

Signatures to Frequency have an expiration set to a future Frequency block number.
If the actions are not submitted before expriation, Frequency will reject the transactions and your application will need to request new signatures from Frequency Access.

[Payload Examples and Signature Details](../Payloads.md)

### `login`

The correct delegation for the user already exists.
No submission to the chain is required, but the application *must* validate the signature to be sure that the user is authenticated.

The message signed follows [CAIP-122: Sign in With X](https://chainagnostic.org/CAIPs/caip-122) specification which is derived from [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361).

#### Example Message with Placeholders
```
{{domain}} wants you to sign in with your Frequency account:
frequency:{{chainReference}}:{{ss58Address}}

URI: {{uri}}
Version: {{version}}
Nonce: {{nonce}}
Chain ID: frequency:{{chainReference}}
Issued At: {{issued-at}}
```

#### Validation Steps
1. Perform an Sr25519 signature verification using:
    - `userPublicKey`: The signing key
    - `payload.message`: The signed message parsing `\n` into `LF` line breaks
    - `signature.encodedValue`: The signature
2. Verify that the `userPublicKey` matches the second line of the message for the correct chain identifier
    - Production-Mainnet: `frequency:mainnet:`
    - Staging-Testnet: `frequency:testnet-paseo:`
3. Verify that the message starts with your domain based on [RFC 4501](https://www.rfc-editor.org/rfc/rfc4501.html) `dnsauthority`
4. Verify the `Issued At` value from the message is within your acceptable time range
5. Verify that `Nonce` value in the message is not being reused

#### Parsing the Message Data

1. Break the lines by `\n`
2. Match based on the prefix:
    - `Nonce: `
    - `Issued At: `
    - `URI: `

### `addProvider`

The user either needs a new delegation or a new MSA created with the delegation.

The `endpoint.extrinsic` field will distinguish between the two:
- `createSponsoredAccountWithDelegation`: New MSA
- `grantDelegation`: New/Updated Delegation

[See Frequency Documentation](https://frequency-chain.github.io/frequency/pallet_msa/index.html#extrinsics) on forming the transaction for the extrinsics.

### `itemActions`

Item actions will update the user's chain data for things such as their public key for the encrypted graph.
These actions *must* be submitted to the chain for the correct functioning of private graph and other systems.

[See Frequency Documentation](https://frequency-chain.github.io/frequency/pallet_stateful_storage/index.html#extrinsics) on forming the transaction for the extrinsics.


### `claimHandle`

The user wishes to claim a Frequency Handle.

[See Frequency Documentation](https://frequency-chain.github.io/frequency/pallet_handles/index.html#extrinsics) on forming the transaction for the extrinsics.

## Step 6: Frequency Transaction Submission

All payloads that are returned will be able to be processed using [Capacity on Frequency](https://frequency-chain.github.io/frequency/pallet_frequency_tx_payment/index.html#extrinsics).

Frequency submission is required for any of the following payloads:
- `addProvider`
- `itemActions`
- `claimHandle`

They can be submitted to the chain in one transaction using [`pay_with_capacity_batch_all`](https://frequency-chain.github.io/frequency/pallet_frequency_tx_payment/index.html#extrinsics).

## Step 6: Session Starts

Once the payloads have been validated, the user's authenticated session may start.
Frequency Access does not manage user sessions.

### Examples

## New Frequency User Response

{{#markdown-embed src/DataStructures/Response-NewUser.md 0}}

## New Application/Delegation Response

{{#markdown-embed src/DataStructures/Response-NewProvider.md 0}}

## Login Only Response

{{#markdown-embed src/DataStructures/Response-LoginOnly.md 0}}
