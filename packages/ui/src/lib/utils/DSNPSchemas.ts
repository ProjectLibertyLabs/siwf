import type { SchemaName } from '@projectlibertylabs/siwf-utils';
export interface SchemaData {
  name: SchemaName;
  version?: number;
  description: string;
  id?: number;
}

export const DSNPSchemas: SchemaData[] = [
  {
    name: 'dsnp.broadcast@v1',
    description: 'Post a public message',
  },
  {
    name: 'dsnp.broadcast@v2',
    description: 'Post a public message',
  },
  {
    name: 'dsnp.dsnp-content-attribute-set@v1',
    description: 'Create DSNP content attributes',
  },
  {
    name: 'dsnp.ext-content-attribute-set@v1',
    description: 'Create external content attributes',
  },
  {
    name: 'dsnp.private-connections@v1',
    description: 'Establish private, mutual connections between two identities',
  },
  {
    name: 'dsnp.private-follows@v1',
    description: 'Privately follow another identity',
  },
  {
    name: 'dsnp.profile-resources@v1',
    description: 'Publish public profile',
  },
  {
    name: 'dsnp.profile@v1',
    description: '(Deprecated) Publish profile updates',
  },
  {
    name: 'dsnp.public-follows@v1',
    description: 'Publicly follow another identity',
  },
  {
    name: 'dsnp.public-key-assertion-method@v1',
    description: 'Announce that a new cryptographic key has been added for assertation validation',
  },
  {
    name: 'dsnp.public-key-key-agreement@v1',
    description: 'Announce that a new cryptographic key has been added for graph privacy',
  },
  {
    name: 'dsnp.reaction@v1',
    description: 'Publish emoji reactions to a Broadcast',
  },
  {
    name: 'dsnp.reply@v1',
    description: 'Post a public reply to a Broadcast',
  },
  {
    name: 'dsnp.reply@v2',
    description: 'Post a public reply to a Broadcast',
  },
  {
    name: 'dsnp.tombstone@v1',
    description:
      'Publish a notice that previously announced content is invalid and the related Announcement should be considered reverted',
  },
  {
    name: 'dsnp.tombstone@v2',
    description:
      'Publish a notice that previously announced content is invalid and the related Announcement should be considered reverted',
  },
  {
    name: 'dsnp.update@v1',
    description: 'Update previously announced content',
  },
  {
    name: 'dsnp.update@v2',
    description: 'Update previously announced content',
  },
  {
    name: 'dsnp.user-attribute-set@v1',
    description: '(Deprecated) Create attributes',
  },
  {
    name: 'dsnp.user-attribute-set@v2',
    description: 'Create attributes',
  },
  {
    name: 'frequency.default-token-address@v1',
    description: 'Set default token address',
  },
];
