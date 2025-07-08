<script lang="ts">
	import { generateAuthenticationUrl } from '@projectlibertylabs/siwf';
	export let encodedRequest = '';
	export let requestJson = '';
	export let chainEnv = '';

	$: mainnet = generateAuthenticationUrl(encodedRequest, '', {
		endpoint: 'production',
		chainType: 'Mainnet-Frequency'
	});
	$: testnet = generateAuthenticationUrl(encodedRequest, '', {
		endpoint: 'staging',
		chainType: 'Paseo-Testnet-Frequency'
	});
</script>

<h2>Result</h2>
<dl>
	<dt>
		Login Request Payload and Signature (
		<code>signedRequest</code>
		parameter )
	</dt>
	<dd>
		<textarea readonly style="width: 100%; height: 6em; font-size: 1.5rem;"
			>{encodedRequest}</textarea
		>
	</dd>
	{#if chainEnv === '' || chainEnv === 'mainnet'}
		<dt>Mainnet/Production URL</dt>
		<dd>
			<input
				style="font-size: 1.5rem;"
				type="text"
				id="mainnet_generated_url"
				readonly
				value={mainnet}
			/>
		</dd>
	{/if}
	{#if chainEnv === '' || chainEnv === 'testnet'}
		<dt>Testnet/Staging URL</dt>
		<dd>
			<input
				style="font-size: 1.5rem;"
				type="text"
				id="testnet_generated_url"
				readonly
				value={testnet}
			/>
		</dd>
	{/if}
	<dt>Signed Request (JSON)</dt>
	<dd>
		<details>
			<summary style="cursor: pointer;">Expand</summary>
			<pre style="overflow:scroll; width: 100%; padding-bottom: 1.5rem;">{requestJson}</pre>
		</details>
	</dd>
</dl>
