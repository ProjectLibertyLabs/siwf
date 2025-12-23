<script lang="ts">
	import { INTENT_INFOS } from '$lib/intents';
	export let permissions: number[] = [];

	const genBundle = (name: string, fullNames: string[]): [string, number[]] => {
		const bundleName = `${name} <span title="${fullNames.join(', ')}">ⓘ</span>`;

		return [bundleName, fullNames.map((n) => INTENT_INFOS.get(n)!.id)];
	};

	const individualIntents: [string, number[]][] = [...INTENT_INFOS.entries()]
		// Don't show things that are signature required
		.filter(([_n, v]) => !v.signatureRequired)
		.map(([_n, v]): [string, number[]] => [
			`${v.protocolName}.${v.name}: ${v.description}`,
			[v.id]
		])
		.toSorted((a, b) => a[0].localeCompare(b[0]));

	const knownPermissions = Object.fromEntries([
		genBundle('Bundle: Public & Private Graph', [
			'dsnp.public-follows',
			'dsnp.private-connections',
			'dsnp.private-follows',
			'dsnp.public-key-key-agreement'
		]),
		genBundle('Bundle: DSNP v1.3 Content', [
			'dsnp.broadcast',
			'dsnp.reply',
			'dsnp.tombstone',
			'dsnp.reaction',
			'dsnp.update'
		]),
		genBundle('(Deprecated) Bundle: DSNP v1.0 Content', [
			'dsnp.broadcast',
			'dsnp.reply',
			'dsnp.tombstone',
			'dsnp.reaction',
			'dsnp.update'
		]),
		...individualIntents
	]);

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
		{#each Object.entries(knownPermissions) as [name, ids] (name)}
			<label>
				<input type="checkbox" bind:group={selectedGroups} value={ids} />
				<!-- eslint-disable eslint-disable-next-line svelte/no-at-html-tags -->
				{@html name}
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
			<label for="schemaIds">Read Only: List of Intent Ids</label>
			<input
				type="text"
				placeholder="List of Intent Ids"
				id="schemaIds"
				value={permissions.join(', ')}
			/>
		</div>
	</div>
</fieldset>
