<script lang="ts">
	import { onMount } from 'svelte';
	import type { SignerPayloadRaw } from '@polkadot/types/types';
	import { generateRequestSigningData } from '@projectlibertylabs/siwa';
	import type { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

	export let callbackUri = '';
	export let permissions: number[] = [];
	export let signature = '';
	export let signerPublicKey = '';
	export let isLoading = true;

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

	// Wallet access
	let thisWeb3Enable: typeof web3Enable | null = null;
	let thisWeb3Accounts: typeof web3Accounts | null = null;
	let thisWeb3FromAddress: typeof web3FromAddress | null = null;

	let walletAccounts: [string, string][] = [];
	let selectedAccount: string;

	let generatedSigningData = '';
	// Generate signing data when the input changes
	$: generatedSigningData = generateRequestSigningData(callbackUri, permissions, false);

	async function connectToWallet() {
		isLoading = true;

		try {
			// Check if the Polkadot{.js} wallet extension is installed.
			if (thisWeb3Accounts && thisWeb3Enable) {
				const extensions = await thisWeb3Enable('Signature Generator Tool');
				if (!extensions || !extensions.length) {
					alert('Polkadot Wallet Compatible extension not found; please install one first.');
					throw new Error(
						'Polkadot Wallet Compatible extension not found; please install one first.'
					);
				}
				walletAccounts = (await thisWeb3Accounts())
					.map((account): [string, string] => [
						account.address,
						`${account.meta.name} (${account.address})`
					])
					.toSorted((a, b) => a[1].localeCompare(b[1]));
			}
		} catch (e) {
			console.error('Unable to load extension accounts', e);
		}

		isLoading = false;
	}

	async function requestSignature() {
		isLoading = true;
		try {
			signerPublicKey = selectedAccount;
			const extension = thisWeb3FromAddress ? await thisWeb3FromAddress(signerPublicKey) : null;
			const sign = extension?.signer?.signRaw;
			const signerPayloadRaw: SignerPayloadRaw = {
				address: signerPublicKey,
				data: generatedSigningData,
				type: 'payload'
			};
			signature = sign ? (await sign(signerPayloadRaw)).signature : '';
		} finally {
			isLoading = false;
		}
	}

	function handleWalletSign() {
		if (walletAccounts.length > 0) {
			return requestSignature();
		} else {
			return connectToWallet();
		}
	}

	// We need to access the user's wallet to get the accounts
	onMount(async () => {
		// This must be in onMount because the extension requires that you have a window to attach to.
		// Since this project is precompiled, there will be no window until onMount
		const polkadotExt = await import('@polkadot/extension-dapp');
		thisWeb3Enable = polkadotExt.web3Enable;
		thisWeb3Accounts = polkadotExt.web3Accounts;
		thisWeb3FromAddress = polkadotExt.web3FromAddress;
		isLoading = false;
	});
</script>

{#if walletAccounts.length > 0}
	<div class="mb-4">
		<select id="walletAccount" bind:value={selectedAccount}>
			{#each walletAccounts as [address, display]}
				<option value={address}>
					{display}
				</option>
			{/each}
		</select>
		<p class="text-xs">
			Don't see your account listed? Make sure it is allowed to be connected in your wallet
			extension.
		</p>
	</div>
{/if}

{#if signature.length}
	<dl>
		<dt>Wallet Signature</dt>
		<dd style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
			{signature}
		</dd>
	</dl>
{/if}

<button disabled={isLoading} on:click={handleWalletSign}>
	{#if walletAccounts.length === 0}
		Connect to Wallet
	{:else}
		Sign With Selected Address
	{/if}
	{#if isLoading}
		(Loading...)
	{/if}
</button>
