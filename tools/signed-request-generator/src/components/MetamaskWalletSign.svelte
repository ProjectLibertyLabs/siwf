<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getEip712BrowserRequestSiwfSignedRequestPayload,
		EIP712_DOMAIN_TESTNET,
		EIP712_DOMAIN_MAINNET
	} from '@frequency-chain/ethereum-utils';

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
	let thisWeb3Enable: boolean;
	let walletAccounts: string[] = [];
	let selectedAccount: string;
	let chainId: string;

	async function connectToWallet() {
		isLoading = true;

		try {
			// Check if Metamask wallet extension is installed.
			if (!thisWeb3Enable) {
				alert('Metamask Wallet Compatible extension not found; please install one first.');
				throw new Error(
					'Metamask Wallet Compatible extension not found; please install one first.'
				);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				if (Array.isArray(accounts)) {
					walletAccounts = (accounts as string[]).toSorted((a: string, b: string) =>
						a.localeCompare(b)
					);
				} else {
					walletAccounts = [];
				}
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
			const domain =
				chainId === EIP712_DOMAIN_TESTNET.chainId ? EIP712_DOMAIN_TESTNET : EIP712_DOMAIN_MAINNET;
			const signatureRequest = getEip712BrowserRequestSiwfSignedRequestPayload(
				callbackUri,
				permissions,
				undefined,
				domain
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			signature = await (window as any).ethereum.request({
				method: 'eth_signTypedData_v4',
				params: [selectedAccount, signatureRequest]
			});
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		thisWeb3Enable = (window as any).ethereum && (window as any).ethereum.isMetaMask;
		walletAccounts = [];
		chainId = '';
		selectedAccount = '';
		isLoading = false;
	});
</script>

{#if walletAccounts.length > 0}
	<div class="mb-4">
		<select id="walletAccount" bind:value={selectedAccount}>
			{#each walletAccounts as address (address)}
				<option value={address}>
					{address}
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
