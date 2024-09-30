# Credentials

## Request Structure

The request is a an array that requires ALL listed credential objects.
Supported Options:

- `anyOf`: Request for one or more credentials from the list (0+ may return)

### Example Request

This is a common request: one verified contact method and access to the graph encryption key.

```json
[
  {
    "type": "VerifiedGraphKeyCredential",
    "hash": ["bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y"]
  },
  {
    "anyOf": [
      {
        "type": "VerifiedEmailAddressCredential",
        "hash": ["bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi"]
      },
      {
        "type": "VerifiedPhoneNumberCredential",
        "hash": ["bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq"]
      }
    ]
  }
]
```

## Available Credentials

Each request also has a multiformat hash of the schema file to ensure the correct verification document is requested.
Below are the official types and multihashes to use.

### Graph Key

- URL: [https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json](https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json)

```json
{
  "type": "VerifiedGraphKeyCredential",
  "hash": ["bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y"]
}
```

### Email

- URL: [https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json](https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json)

```json
{
  "type": "VerifiedEmailAddressCredential",
  "hash": ["bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi"]
}
```

### Phone/SMS

- URL: [https://schemas.frequencyaccess.com/VerifiedPhoneNumberCredential/bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq.json](https://schemas.frequencyaccess.com/VerifiedPhoneNumberCredential/bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq.json)

```json
{
  "type": "VerifiedPhoneNumberCredential",
  "hash": ["bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq"]
}
```
