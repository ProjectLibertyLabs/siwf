```json
{
  "requestedSignatures": {
    "publicKey": {
      "encodedValue": "0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac",
      "encoding": "base16",
      "format": "eip-55",
      "type": "Secp256k1"
    },
    "signature": {
      "algo": "SECP256K1",
      "encoding": "base16",
      "encodedValue": "0xaaeb3512bf3345e98a890f140954b00d1600203406e9ed85e732ad389f5a60e264bfc9808ade80e6b9cc9c6182b52e2a57052eff091e50e40f75af386eaea6551b"
    },
    "payload": {
      "callback": "http://localhost:3000",
      "permissions": [
        5,
        7,
        8,
        9,
        10
      ]
    }
  },
  "requestedCredentials": [
    {
      "type": "VerifiedGraphKeyCredential",
      "hash": [
        "bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y"
      ]
    },
    {
      "anyOf": [
        {
          "type": "VerifiedEmailAddressCredential",
          "hash": [
            "bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi"
          ]
        },
        {
          "type": "VerifiedPhoneNumberCredential",
          "hash": [
            "bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq"
          ]
        }
      ]
    }
  ]
}
```
