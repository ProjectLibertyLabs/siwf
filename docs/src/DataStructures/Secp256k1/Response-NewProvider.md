```json
{
  "userPublicKey": {
    "encodedValue": "f6d1YDa4agkaQ5Kqq8ZKwCf2Ew8UFz9ot2JNrBwHsFkhdtHEn",
    "encoding": "base58",
    "format": "ss58",
    "type": "Secp256k1"
  },
  "payloads": [
    {
      "signature": {
        "algo": "SECP256K1",
        "encoding": "base16",
        "encodedValue": "0xb3e41e53373649d089455965791c47f695f519eb21bd322febf04bd05f2b50b72c395c4490ac6cd0d108d0a77f625aea8b1f0096befc359936669d620f5aad7e1c"
      },
      "endpoint": {
        "pallet": "msa",
        "extrinsic": "grantDelegation"
      },
      "type": "addProvider",
      "payload": {
        "authorizedMsaId": 1,
        "schemaIds": [
          5,
          7,
          8,
          9,
          10
        ],
        "expiration": 24
      }
    }
  ],
  "credentials": []
}
```
