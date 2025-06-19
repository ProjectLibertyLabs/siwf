```json
{
  "userPublicKey": {
    "encodedValue": "f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ",
    "encoding": "base58",
    "format": "ss58",
    "type": "Sr25519"
  },
  "payloads": [
    {
      "signature": {
        "algo": "SR25519",
        "encoding": "base16",
        "encodedValue": "0x3673ac632287ae9de92c9700a18b449153f67a7ffff50267f4e672b1181c1d7fa12e491c3554d0ea39f78c3b51785e44be569e484441542ff353284e53079385"
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
        "algo": "SR25519",
        "encoding": "base16",
        "encodedValue": "0xf21ca972dd02087225e1f6c06da42f0dd3704858869d9eb16404512e14c8030e287ee1f581b2b1c5bc7ebde8835cfad71b9c33702680dc07029c6efbccd0a683"
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
        "algo": "SR25519",
        "encoding": "base16",
        "encodedValue": "0xeaaeaa51a1b34ed6b91ff4f220e0691077de6eb35f950d7b89e463f4f9a0f679a4280e22fed8c76c4df362a2f87562bc4e2a367f15229bc0d6446339b5fa7d84"
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
  "credentials": [
    {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://www.w3.org/ns/credentials/undefined-terms/v2"
      ],
      "type": [
        "VerifiedEmailAddressCredential",
        "VerifiableCredential"
      ],
      "issuer": "did:web:frequencyaccess.com",
      "validFrom": "2024-08-21T21:28:08.289+0000",
      "credentialSchema": {
        "type": "JsonSchema",
        "id": "https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json"
      },
      "credentialSubject": {
        "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
        "emailAddress": "john.doe@example.com",
        "lastVerified": "2024-08-21T21:27:59.309+0000"
      },
      "proof": {
        "type": "DataIntegrityProof",
        "verificationMethod": "did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
        "cryptosuite": "eddsa-rdfc-2022",
        "proofPurpose": "assertionMethod",
        "proofValue": "z4jArnPwuwYxLnbBirLanpkcyBpmQwmyn5f3PdTYnxhpy48qpgvHHav6warjizjvtLMg6j3FK3BqbR2nuyT2UTSWC"
      }
    },
    {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://www.w3.org/ns/credentials/undefined-terms/v2"
      ],
      "type": [
        "VerifiedGraphKeyCredential",
        "VerifiableCredential"
      ],
      "issuer": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
      "validFrom": "2024-08-21T21:28:08.289+0000",
      "credentialSchema": {
        "type": "JsonSchema",
        "id": "https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json"
      },
      "credentialSubject": {
        "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
        "encodedPublicKeyValue": "0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17",
        "encodedPrivateKeyValue": "0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87",
        "encoding": "base16",
        "format": "bare",
        "type": "X25519",
        "keyType": "dsnp.public-key-key-agreement"
      },
      "proof": {
        "type": "DataIntegrityProof",
        "verificationMethod": "did:key:z6MktZ15TNtrJCW2gDLFjtjmxEdhCadNCaDizWABYfneMqhA",
        "cryptosuite": "eddsa-rdfc-2022",
        "proofPurpose": "assertionMethod",
        "proofValue": "z2HHWwtWggZfvGqNUk4S5AAbDGqZRFXjpMYAsXXmEksGxTk4DnnkN3upCiL1mhgwHNLkxY3s8YqNyYnmpuvUke7jF"
      }
    }
  ]
}
```
