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
        "extrinsic": "createSponsoredAccountWithDelegation"
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
    },
    {
      "signature": {
        "algo": "SECP256K1",
        "encoding": "base16",
        "encodedValue": "0xfd1d273752f6494cf64bc7091b37fce35f1bdd861b676c7f5ee392675453764f2e322797b6a5f676e6716738c5ba8fabe82de83dbe5bf9d9e771ef717ff036241c"
      },
      "endpoint": {
        "pallet": "statefulStorage",
        "extrinsic": "applyItemActionsWithSignatureV2"
      },
      "type": "itemActions",
      "payload": {
        "schemaId": 7,
        "targetHash": 0,
        "expiration": 20,
        "actions": [
          {
            "type": "addItem",
            "payloadHex": "0x40eea1e39d2f154584c4b1ca8f228bb49ae5a14786ed63c90025e755f16bd58d37"
          }
        ]
      }
    },
    {
      "signature": {
        "algo": "SECP256K1",
        "encoding": "base16",
        "encodedValue": "0xeaa194e6f0074d777633522370fc0f74b200d933e1f1219bc8379ace1fb42759463e7b71d796abf839f2c1f78ecd0af4872010300afac4fbdb44d584c4686e041b"
      },
      "endpoint": {
        "pallet": "handles",
        "extrinsic": "claimHandle"
      },
      "type": "claimHandle",
      "payload": {
        "baseHandle": "ExampleHandle",
        "expiration": 24
      }
    }
  ],
  "credentials": []
}
```
