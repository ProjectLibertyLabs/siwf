// If this is updated, you might also need to update Delegations.md via:
// npx tsx tools/signed-request-generator/generate-available-delegations.ts

export interface SchemaInfo {
	description: string;
	id: number;
	name: string;
	namespace: string;
	version: number;
	signatureRequired: boolean;
	deprecated: boolean;
	specUrl: string;
}

const schemaFullName = (info: SchemaInfo): string =>
	`${info.namespace}.${info.name}@v${info.version}`;

export const SCHEMA_INFOS: Map<string, SchemaInfo> = new Map(
	[
		{
			description: 'Create new public content',
			id: 2,
			name: 'broadcast',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: true,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Broadcast.html'
		},
		{
			description: 'Create new public content',
			id: 17,
			name: 'broadcast',
			namespace: 'dsnp',
			version: 2,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Broadcast.html'
		},
		{
			description: 'Create an authenticated attribute set for DSNP content',
			id: 12,
			name: 'dsnp-content-attribute',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/DSNPContentAttributeSet.html'
		},
		{
			description: 'Create an authenticated attribute set for content external to DSNP',
			id: 13,
			name: 'ext-content-attribute',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/ExternalContentAttributeSet.html'
		},
		{
			description: 'Update private friendship connections',
			id: 10,
			name: 'private-connections',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update private follow list',
			id: 9,
			name: 'private-follows',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update user profile information',
			id: 15,
			name: 'profile-resources',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update profile information',
			id: 6,
			name: 'profile',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: true,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Profile.html'
		},
		{
			description: 'Update public follow list',
			id: 8,
			name: 'public-follows',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Used to verify generic cryptographic signatures',
			id: 14,
			name: 'public-key-assertion-method',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: true,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Publish new public key for the encrypted social graph',
			id: 7,
			name: 'public-key-key-agreement',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: true,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Public reaction to content',
			id: 4,
			name: 'reaction',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Reaction.html'
		},
		{
			description: 'Public reply to a content',
			id: 3,
			name: 'reply',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: true,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Reply.html'
		},
		{
			description: 'Public reply to a content',
			id: 18,
			name: 'reply',
			namespace: 'dsnp',
			version: 2,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Reply.html'
		},
		{
			description: 'Mark content for deletion',
			id: 1,
			name: 'tombstone',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: true,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Tombstone.html'
		},
		{
			description: 'Mark content for deletion',
			id: 16,
			name: 'tombstone',
			namespace: 'dsnp',
			version: 2,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Tombstone.html'
		},
		{
			description: 'Update an existing post or reply',
			id: 5,
			name: 'update',
			namespace: 'dsnp',
			version: 1,
			signatureRequired: false,
			deprecated: true,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Update.html'
		},
		{
			description: 'Update an existing post or reply',
			id: 19,
			name: 'update',
			namespace: 'dsnp',
			version: 2,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Update.html'
		},
		// Never used
		// {
		// 	description: '',
		// 	id: 11,
		// 	name: 'user-attribute-set',
		// 	namespace: 'dsnp',
		// 	version: 1,
		// 	signatureRequired: false,
		// 	deprecated: true,
		// specUrl: '',
		// },
		{
			description: 'Create an authenticated attribute set for a DSNP User',
			id: 20,
			name: 'user-attribute-set',
			namespace: 'dsnp',
			version: 2,
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/UserAttributeSet.html'
		},
		{
			description: 'List one or more default token receiving addresses',
			id: 21,
			name: 'default-token-address',
			namespace: 'frequency',
			version: 1,
			signatureRequired: true,
			deprecated: false,
			specUrl: 'https://github.com/frequency-chain/schemas'
		}
	].map((x) => [schemaFullName(x), x])
);
