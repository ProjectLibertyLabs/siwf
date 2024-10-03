import { type SchemaName } from '@dsnp/frequency-schemas/dsnp';
export interface SchemaData {
  name: SchemaName;
  version?: number;
  description: string;
  id?: number;
}

export const DSNPSchemas: SchemaData[] = [
  {
    name: 'tombstone',
    description:
      'Publish a notice that previously announced content is invalid and the related Announcement should be considered reverted',
  },
  {
    name: 'broadcast',
    description: 'Post a public message',
  },
  {
    name: 'reply',
    description: 'Post a public reply to a Broadcast',
  },
  {
    name: 'reaction',
    description: 'Publish emoji reactions to a Broadcast',
  },
  {
    name: 'profile-resources',
    description: 'Publish profile updates',
  },
  {
    name: 'update',
    description: 'Update previously announced content',
  },
  {
    name: 'public-key-key-agreement',
    description: 'Announce that a new cryptographic key has been added for logins and permissions',
  },
  {
    name: 'public-follows',
    description: 'Publicly follow another identity',
  },
  {
    name: 'private-follows',
    description: 'Privately follow another identity',
  },
  {
    name: 'private-connections',
    description: 'Establish private, mutual connections between two identities',
  },
];
