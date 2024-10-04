<script lang="ts">
	import { SCHEMA_NAME_TO_ID } from '../lib/schemas.js';
	export let permissions: number[] = [];

	const knownPermissions = {
		'Bundle: Private Graph': [
			SCHEMA_NAME_TO_ID.get('dsnp.private-connections@v1'),
			SCHEMA_NAME_TO_ID.get('dsnp.private-follows@v1'),
			SCHEMA_NAME_TO_ID.get('dsnp.public-key-key-agreement@v1')
		],
		'Bundle: Content': [
			SCHEMA_NAME_TO_ID.get('dsnp.broadcast@v2'),
			SCHEMA_NAME_TO_ID.get('dsnp.reply@v2'),
			SCHEMA_NAME_TO_ID.get('dsnp.tombstone@v2'),
			SCHEMA_NAME_TO_ID.get('dsnp.reaction@v1'),
			SCHEMA_NAME_TO_ID.get('dsnp.update@v2')
		],
		...Object.fromEntries([...SCHEMA_NAME_TO_ID.entries()].map(([n, v]) => [n, [v]]))
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
