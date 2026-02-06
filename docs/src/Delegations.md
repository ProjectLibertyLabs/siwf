# Available Delegations

Staging-Testnet and Production-Mainnet have the same delegation Intent Ids available.
Local development chains are also seeded with a genesis that is kept up-to-date with the Intents from Mainnet.

<!---
Generate this table via root with:
npx tsx tools/signed-request-generator/generate-available-delegations.ts
-->

| Short Name and Specification Link                                                                 | Description                                                        | Intent Id |
|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|-----------|
| [`dsnp.broadcast`](https://spec.dsnp.org/DSNP/Types/Broadcast.html)                               | Create new public content                                          | 17        |
| [`dsnp.dsnp-content-attribute`](https://spec.dsnp.org/DSNP/Types/DSNPContentAttributeSet.html)    | Create an authenticated attribute set for DSNP content             | 12        |
| [`dsnp.ext-content-attribute`](https://spec.dsnp.org/DSNP/Types/ExternalContentAttributeSet.html) | Create an authenticated attribute set for content external to DSNP | 13        |
| [`dsnp.private-connections`](https://spec.dsnp.org/DSNP/UserData.html)                            | Update private friendship connections                              | 10        |
| [`dsnp.private-follows`](https://spec.dsnp.org/DSNP/UserData.html)                                | Update private follow list                                         | 9         |
| [`dsnp.profile-resources`](https://spec.dsnp.org/DSNP/UserData.html)                              | Update user profile information                                    | 15        |
| [`dsnp.public-follows`](https://spec.dsnp.org/DSNP/UserData.html)                                 | Update public follow list                                          | 8         |
| [`dsnp.reaction`](https://spec.dsnp.org/DSNP/Types/Reaction.html)                                 | Public reaction to content                                         | 4         |
| [`dsnp.reply`](https://spec.dsnp.org/DSNP/Types/Reply.html)                                       | Public reply to content                                            | 18        |
| [`dsnp.tombstone`](https://spec.dsnp.org/DSNP/Types/Tombstone.html)                               | Mark content for deletion                                          | 16        |
| [`dsnp.update`](https://spec.dsnp.org/DSNP/Types/Update.html)                                     | Update an existing post or reply                                   | 19        |
| [`dsnp.user-attribute-set`](https://spec.dsnp.org/DSNP/Types/UserAttributeSet.html)               | Create an authenticated attribute set for a DSNP User              | 20        |
