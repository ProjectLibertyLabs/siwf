export interface SchemaData {
  id: Record<string, unknown>;
  description: string;
}

export type Schema = Record<string, SchemaData>;

export const DSNPSchemas: Schema = {
  tombstone: {
    id: {
      mainnet: 1,
      rococo: 1,
    },
    description:
      'A previously announced content is invalid and the related Announcement should be considered reverted.',
  },
  broadcast: {
    id: {
      mainnet: 2,
      rococo: 2,
    },
    description: 'Post a public message',
  },
  replay: {
    id: {
      mainnet: 3,
      rococo: 3,
    },
    description: 'Post a public reply to a Broadcast',
  },
  reaction: {
    id: {
      mainnet: 4,
      rococo: 4,
    },
    description: 'Publish emoji reactions to a Broadcast',
  },
  profile: {
    id: {
      mainnet: 6,
      rococo: 5,
    },
    description: 'Publish profile updates',
  },
  update: {
    id: {
      mainnet: 5,
      rococo: 6,
    },
    description: 'Update previously announced content',
  },
  publicKey: {
    id: {
      mainnet: 7,
      rococo: 18,
    },
    description: 'Announce that a new cryptographic key has been added for logins and permissions',
  },
  publicFollows: {
    id: {
      mainnet: 8,
      rococo: 13,
    },
    description: 'Publicly follow another identity',
  },
  privateFollows: {
    id: {
      mainnet: 9,
      rococo: 14,
    },
    description: 'Privately follow another identity',
  },
  privateConnections: {
    id: {
      mainnet: 10,
      rococo: 15,
    },
    description: 'Establish private, mutual connections between two identities',
  },
};
