# Data Structure Reference

## Request / Response from SIWA

### Request

{{#markdown-embed src/DataStructures/Request.md 0}}

### Request URL

{{#markdown-embed src/DataStructures/RequestUrl.md 0}}

### Signed Request

This is JSON stringified and then [`base64url`](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoded for the Request `signedRequest` value.

{{#markdown-embed src/DataStructures/SignedRequest.md 0}}

### New Frequency User Response

{{#markdown-embed src/DataStructures/Response-NewUser.md 0}}

### New Application/Delegation Response

{{#markdown-embed src/DataStructures/Response-NewProvider.md 0}}

### Login Only Response

{{#markdown-embed src/DataStructures/Response-LoginOnly.md 0}}

## Verified User Data

### Graph Key

{{#markdown-embed src/DataStructures/VerifiedGraphKeyPair.md 0}}

## Verified Contact Credentials

### Email

{{#markdown-embed src/DataStructures/VerifiedEmail.md 0}}

### SMS/Phone

{{#markdown-embed src/DataStructures/VerifiedPhone.md 0}}
