# Data Structure Reference

## Request / Response from SIWF

### Request

{{#include Request.md 0}}

### Request URL

{{#include RequestUrl.md 0}}

### Signed Request

This is JSON stringified and then [`base64url`](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoded for the Request `signedRequest` value.

{{#include SignedRequest.md 0}}

### New Frequency User Response

{{#include Response-NewUser.md 0}}

### New Application/Delegation Response

{{#include Response-NewProvider.md}}

### Login Only Response

{{#include Response-LoginOnly.md}}

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
