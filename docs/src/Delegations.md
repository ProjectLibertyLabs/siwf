# Available Delegations

Staging-Testnet and Production-Mainnet have the same delegation Schema Ids available.

<!---
Generate this table via root with:
npx tsx tools/signed-request-generator/generate-available-delegations.ts
-->

| Short Name and Specification Link                                                                    | Description                                                        | Schema Id |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| [`dsnp.broadcast@v1`](https://spec.dsnp.org/DSNP/Types/Broadcast.html)                               | (Deprecated) Create new public content                             | 2         |
| [`dsnp.broadcast@v2`](https://spec.dsnp.org/DSNP/Types/Broadcast.html)                               | Create new public content                                          | 17        |
| [`dsnp.dsnp-content-attribute@v1`](https://spec.dsnp.org/DSNP/Types/DSNPContentAttributeSet.html)    | Create an authenticated attribute set for DSNP content             | 12        |
| [`dsnp.ext-content-attribute@v1`](https://spec.dsnp.org/DSNP/Types/ExternalContentAttributeSet.html) | Create an authenticated attribute set for content external to DSNP | 13        |
| [`dsnp.private-connections@v1`](https://spec.dsnp.org/DSNP/UserData.html)                            | Update private friendship connections                              | 10        |
| [`dsnp.private-follows@v1`](https://spec.dsnp.org/DSNP/UserData.html)                                | Update private follow list                                         | 9         |
| [`dsnp.profile-resources@v1`](https://spec.dsnp.org/DSNP/UserData.html)                              | Update user profile information                                    | 15        |
| [`dsnp.profile@v1`](https://spec.dsnp.org/DSNP/Types/Profile.html)                                   | (Deprecated) Update profile information                            | 6         |
| [`dsnp.public-follows@v1`](https://spec.dsnp.org/DSNP/UserData.html)                                 | Update public follow list                                          | 8         |
| [`dsnp.reaction@v1`](https://spec.dsnp.org/DSNP/Types/Reaction.html)                                 | Public reaction to content                                         | 4         |
| [`dsnp.reply@v1`](https://spec.dsnp.org/DSNP/Types/Reply.html)                                       | (Deprecated) Public reply to a content                             | 3         |
| [`dsnp.reply@v2`](https://spec.dsnp.org/DSNP/Types/Reply.html)                                       | Public reply to a content                                          | 18        |
| [`dsnp.tombstone@v1`](https://spec.dsnp.org/DSNP/Types/Tombstone.html)                               | (Deprecated) Mark content for deletion                             | 1         |
| [`dsnp.tombstone@v2`](https://spec.dsnp.org/DSNP/Types/Tombstone.html)                               | Mark content for deletion                                          | 16        |
| [`dsnp.update@v1`](https://spec.dsnp.org/DSNP/Types/Update.html)                                     | (Deprecated) Update an existing post or reply                      | 5         |
| [`dsnp.update@v2`](https://spec.dsnp.org/DSNP/Types/Update.html)                                     | Update an existing post or reply                                   | 19        |
| [`dsnp.user-attribute-set@v2`](https://spec.dsnp.org/DSNP/Types/UserAttributeSet.html)               | Create an authenticated attribute set for a DSNP User              | 20        |
