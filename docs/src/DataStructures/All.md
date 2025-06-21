# Data Structure Reference

## Request / Response from SIWF

### Request

#### Sr25519
{{#include ./Sr25519/Request.md 0}}

#### Secp256k1
{{#include ./Secp256k1/Request.md 0}}

### Request URL

#### Sr25519
{{#include ./Sr25519/RequestUrl.md 0}}

#### Secp256k1
{{#include ./Secp256k1/RequestUrl.md 0}}

### Signed Request

This is JSON stringified and then [`base64url`](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoded for the Request `signedRequest` value.

#### Sr25519
{{#include ./Sr25519/SignedRequest.md 0}}

#### Secp256k1
{{#include ./Secp256k1/SignedRequest.md 0}}

### New Frequency User Response

#### Sr25519
{{#include ./Sr25519/Response-NewUser.md 0}}

#### Secp256k1
{{#include ./Secp256k1/Response-NewUser.md 0}}

### New Application/Delegation Response

#### Sr25519
{{#include ./Sr25519/Response-NewProvider.md 0}}

#### Secp256k1
{{#include ./Secp256k1/Response-NewProvider.md 0}}

### Login Only Response

#### Sr25519
{{#include ./Sr25519/Response-LoginOnly.md 0}}

#### Secp256k1
{{#include ./Secp256k1/Response-LoginOnly.md 0}}

## Verified User Data

### Graph Key

{{#include VerifiedGraphKeyPair.md}}

## Verified Contact Credentials

### Email

{{#include VerifiedEmail.md}}

### SMS/Phone

{{#include VerifiedPhone.md}}

## Context Data

### Application Context Credential

{{#include ApplicationContext.md:2:}}
