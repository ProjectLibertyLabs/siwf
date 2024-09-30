<script lang="ts">
	import { generateRequestSigningData } from '@projectlibertylabs/siwa';

	export let callbackUri = '';
	export let permissions: number[] = [];
	export let signature = '';
	export let signerPublicKey = '';

	let signingData = '';
	let clearSignatureCheck: string = '';
	function shouldClearSignature(uri: string, params: number[]) {
		const newCheck = `${uri}+${params.join(',')}`;
		const result = newCheck !== clearSignatureCheck;
		clearSignatureCheck = newCheck;
		return result;
	}

	$: if (shouldClearSignature(callbackUri, permissions)) {
		signature = '';
	}

	$: signingData = generateRequestSigningData(callbackUri, permissions);
</script>

<div>
	<label for="signingData">Generated Signing Data to Sign</label>
	<input type="text" id="signingData" readonly bind:value={signingData} />
</div>

<div>
	<label for="signerPublicKey">Signer Public Key</label>
	<input type="text" id="signerPublicKey" bind:value={signerPublicKey} />
</div>

<div>
	<label for="signature">Signature</label>
	<input type="text" id="signature" bind:value={signature} />
</div>
