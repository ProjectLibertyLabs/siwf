<script lang="ts">
	export let permissions: number[] = [];

	// Assumes mainnet schema ids
	const schemas = {
		Tombstone: 1,
		Broadcast: 2,
		Reply: 3,
		Reaction: 4,
		Update: 5,
		Profile: 6,
		PublicKey: 7,
		PublicFollows: 8,
		PrivateFollows: 9,
		PrivateConnections: 10
	};

	const knownPermissions = {
		'Private Graph v1': [schemas.PublicKey, schemas.PrivateFollows, schemas.PrivateConnections],
		'Public Graph v1': [schemas.PublicFollows],
		'Content v1': [
			schemas.Broadcast,
			schemas.Reply,
			schemas.Tombstone,
			schemas.Reaction,
			schemas.Update
		],
		'Profile v1': [schemas.Profile]
	};

	let selectedGroups: number[][] = [];
	let additionalPermissions = '';

	// Combine selected and additional permissions into a single unique array
	$: permissions = buildPermissions(selectedGroups, additionalPermissions);

	// Parse the additional and groups into single sorted list
	function buildPermissions(groups: number[][], additional: string): number[] {
		const more = additional
			.split(',')
			.map((p) => parseInt(p.trim()))
			.filter((p) => !isNaN(p));
		return [...new Set([...groups.flat(), ...more].toSorted((a, b) => a - b)).values()];
	}
</script>

<fieldset>
	<legend>Permissions</legend>
	<div class="checkboxes">
		{#each Object.entries(knownPermissions) as [name, ids]}
			<label>
				<input type="checkbox" bind:group={selectedGroups} value={ids} />
				{name}
			</label>
		{/each}

		<div>
			<label for="additionalPermissions">Additional Permissions (comma-separated)</label>
			<input
				type="text"
				placeholder="1, 5, 20"
				id="additionalPermissions"
				bind:value={additionalPermissions}
			/>
		</div>

		<div class="my-2 text-sm">
			<label for="schemaIds">Read Only: List of Schema Ids</label>
			<input
				type="text"
				placeholder="List of Schema Ids"
				id="schemaIds"
				value={permissions.join(', ')}
			/>
		</div>
	</div>
</fieldset>
