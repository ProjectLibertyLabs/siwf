import type { SchemaName } from '@projectlibertylabs/siwf-utils';
export interface SchemaData {
  name: SchemaName;
  namespace?: string;
  version?: number;
  description: string;
  id?: number;
}

export const DSNPSchemas: SchemaData[] = [
  {
    namespace: 'dsnp',
    name: 'broadcast',
    version: 1,
    description: 'Post a public message',
  },
  {
    namespace: 'dsnp',
    name: 'broadcast',
    version: 2,
    description: 'Post a public message',
  },
  {
    namespace: 'dsnp',
    name: 'dsnp-content-attribute-set',
    version: 1,
    description: 'Create DSNP content attributes',
  },
  {
    namespace: 'dsnp',
    name: 'ext-content-attribute-set',
    version: 1,
    description: 'Create external content attributes',
  },
  {
    namespace: 'dsnp',
    name: 'private-connections',
    version: 1,
    description: 'Establish private, mutual connections between two identities',
  },
  {
    namespace: 'dsnp',
    name: 'private-follows',
    version: 1,
    description: 'Privately follow another identity',
  },
  {
    namespace: 'dsnp',
    name: 'profile-resources',
    version: 1,
    description: 'Publish public profile',
  },
  {
    namespace: 'dsnp',
    name: 'profile',
    version: 1,
    description: '(Deprecated) Publish profile updates',
  },
  {
    namespace: 'dsnp',
    name: 'public-follows',
    version: 1,
    description: 'Publicly follow another identity',
  },
  {
    namespace: 'dsnp',
    name: 'public-key-assertion-method',
    version: 1,
    description: 'Announce that a new cryptographic key has been added for assertation validation',
  },
  {
    namespace: 'dsnp',
    name: 'public-key-key-agreement',
    version: 1,
    description: 'Announce that a new cryptographic key has been added for graph privacy',
  },
  {
    namespace: 'dsnp',
    name: 'reaction',
    version: 1,
    description: 'Publish emoji reactions to a Broadcast',
  },
  {
    namespace: 'dsnp',
    name: 'reply',
    version: 1,
    description: 'Post a public reply to a Broadcast',
  },
  {
    namespace: 'dsnp',
    name: 'reply',
    version: 2,
    description: 'Post a public reply to a Broadcast',
  },
  {
    namespace: 'dsnp',
    name: 'tombstone',
    version: 1,
    description:
      'Publish a notice that previously announced content is invalid and the related Announcement should be considered reverted',
  },
  {
    namespace: 'dsnp',
    name: 'tombstone',
    version: 2,
    description:
      'Publish a notice that previously announced content is invalid and the related Announcement should be considered reverted',
  },
  {
    namespace: 'dsnp',
    name: 'update',
    version: 1,
    description: 'Update previously announced content',
  },
  {
    namespace: 'dsnp',
    name: 'update',
    version: 2,
    description: 'Update previously announced content',
  },
  {
    namespace: 'dsnp',
    name: 'user-attribute-set',
    version: 1,
    description: '(Deprecated) Create attributes',
  },
  {
    namespace: 'dsnp',
    name: 'user-attribute-set',
    version: 2,
    description: 'Create attributes',
  },
  {
    namespace: 'freq',
    name: 'ency.default-token-address',
    version: 1,
    description: 'Set default token address',
  },
];
