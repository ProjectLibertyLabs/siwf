# Frequency Access Actions

Frequency Access handles three different situations for each user:

| Action            | Frequency Blockchain account (MSA) | Delegation with Your Application |
| ----------------- | ---------------------------------- | -------------------------------- |
| Create Account    | _Required_                         | _Required_                       |
| Create Delegation | Existing                           | _New or Updated Required_        |
| Login             | Existing                           | Existing                         |

## General Flow

1. Generate Provider Login Request Payload and Signature ([Generator Tool](../Generate.md)) ([Documentation](../SignatureGeneration.md))
2. Build and send the user to the Authentication URL ([See Details](./Start.md))
3. Receive a callback from Frequency Access
4. Retrieve and process the login response from Frequency Access ([See Details](./Response.md))

### Sequence Diagram

![General Flow Sequency Diagram](./flow.svg)

## Backend Requirements

- Able to validate payloads from Frequency Access
- Able to connect to a Frequency RPC Node
- Able to sign transactions to submit to the Frequency RPC Node

{{#button-links}}
