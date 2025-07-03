```json
{
  "requestedSignatures": {
    "publicKey": {
      "encodedValue": "f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH",
      "encoding": "base58",
      "format": "ss58",
      "type": "Sr25519"
    },
    "signature": {
      "algo": "SR25519",
      "encoding": "base16",
      "encodedValue": "0xd09b64000056904640355f239e5ef3bb4962b2c4b817201d402a08f13d11973111b45ba25f83f729d602698e669b34cbc0ca071a1158770b92932e027f5fbb85"
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
      "type": "VerifiedRecoverySecretCredential",
      "hash": [
        "bciqpg6qm4rnu2j4v6ghxqqgwkggokwvxs3t2bexbd3obkypkiryylxq"
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
  ],
  "applicationContext": {
    "url": "https://example.org/myapp/siwf-manifest.json"
  }
}
```
