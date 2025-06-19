```json
{
  "requestedSignatures": {
    "publicKey": {
      "encodedValue": "f6d1YDa4agkaQ5Kqq8ZKwCf2Ew8UFz9ot2JNrBwHsFkhdtHEn",
      "encoding": "base58",
      "format": "ss58",
      "type": "Secp256k1"
    },
    "signature": {
      "algo": "SECP256K1",
      "encoding": "base16",
      "encodedValue": "0x8248785b609da7f257667c55ac6cbf78f2b5d42aa63334950fbaa33cf6c719d6010b23d179819461287a67edc3d420b048fb69d0cb06247382adb5b412ebed1b1c"
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
