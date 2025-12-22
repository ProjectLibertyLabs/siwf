// If this is updated, you might also need to update Delegations.md via:
// npx tsx tools/signed-request-generator/generate-available-delegations.ts

export interface IntentInfo {
	description: string;
	id: number;
	name: string;
	protocolName: string;
	signatureRequired: boolean;
	specUrl: string;
}

const intentFullName = (info: IntentInfo): string => `${info.protocolName}.${info.name}`;

export const INTENT_INFOS: Map<string, IntentInfo> = new Map(
	[
		{
			description: 'Create new public content',
			id: 17,
			name: 'broadcast',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Broadcast.html'
		},
		{
			description: 'Create an authenticated attribute set for DSNP content',
			id: 12,
			name: 'dsnp-content-attribute',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/DSNPContentAttributeSet.html'
		},
		{
			description: 'Create an authenticated attribute set for content external to DSNP',
			id: 13,
			name: 'ext-content-attribute',
			protocolName: 'dsnp',
			signatureRequired: false,
			deprecated: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/ExternalContentAttributeSet.html'
		},
		{
			description: 'Update private friendship connections',
			id: 10,
			name: 'private-connections',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update private follow list',
			id: 9,
			name: 'private-follows',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update user profile information',
			id: 15,
			name: 'profile-resources',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Update public follow list',
			id: 8,
			name: 'public-follows',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Used to verify generic cryptographic signatures',
			id: 14,
			name: 'public-key-assertion-method',
			protocolName: 'dsnp',
			signatureRequired: true,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Publish new public key for the encrypted social graph',
			id: 7,
			name: 'public-key-key-agreement',
			protocolName: 'dsnp',
			signatureRequired: true,
			specUrl: 'https://spec.dsnp.org/DSNP/UserData.html'
		},
		{
			description: 'Public reaction to content',
			id: 4,
			name: 'reaction',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Reaction.html'
		},
		{
			description: 'Public reply to content',
			id: 18,
			name: 'reply',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Reply.html'
		},
		{
			description: 'Mark content for deletion',
			id: 16,
			name: 'tombstone',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Tombstone.html'
		},
		{
			description: 'Update an existing post or reply',
			id: 19,
			name: 'update',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/Update.html'
		},
		// Never used
		// {
		// 	description: '',
		// 	id: 11,
		// 	name: 'user-attribute-set',
		// 	protocolName: 'dsnp',
		// 	signatureRequired: false,
		// specUrl: '',
		// },
		{
			description: 'Create an authenticated attribute set for a DSNP User',
			id: 20,
			name: 'user-attribute-set',
			protocolName: 'dsnp',
			signatureRequired: false,
			specUrl: 'https://spec.dsnp.org/DSNP/Types/UserAttributeSet.html'
		},
		{
			description: 'List one or more default token receiving addresses',
			id: 21,
			name: 'default-token-address',
			protocolName: 'frequency',
			signatureRequired: true,
			specUrl: 'https://github.com/frequency-chain/schemas'
		}
	].map((x) => [intentFullName(x), x])
);
