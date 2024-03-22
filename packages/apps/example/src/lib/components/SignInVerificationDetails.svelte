<script lang="ts">
  import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
  import { u8aToHex } from '@polkadot/util';
  import type { SiwsMessage } from '@talismn/siws';
  import Icon from '@iconify/svelte';
  import { doesPublicKeyControlMsa } from '@amplicalabs/siwf';
  import { onDestroy, onMount } from 'svelte';
  import type { ApiPromise } from '@polkadot/api';

  export let siwsMessage: SiwsMessage;
  export let message: string;
  export let signature: `0x${string}`;
  export let api: ApiPromise;
  const baseTimeoutSecs = 3;

  let signatureVerified: boolean = false;
  let msaId: string;
  let msaOwnershipVerified = false;
  let timeoutId: number;
  let backoff = 0;
  let isExpired: boolean;

  function isValidSignature(signedMessage: string, signature: `0x${string}`, address: string): boolean {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);

    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  }

  function checkExpiration() {
    isExpired = (siwsMessage.expirationTime ?? 0) < Date.now();
    console.log(`Payload is ${isExpired ? 'expired' : 'not expired'}`);
    const timeout = Math.pow(baseTimeoutSecs, ++backoff) * 1_000;
    if (!isExpired) {
      timeoutId = setTimeout(checkExpiration, timeout) as unknown as number;
    }
  }

  $: {
    signatureVerified = isValidSignature(message, signature, siwsMessage.address);
    const resources = siwsMessage.resources;
    const msaUri = new URL(resources?.[0] || '');
    msaId = msaUri.pathname.slice(2);
    if (msaId) {
      doesPublicKeyControlMsa(msaId, siwsMessage.address, api)
        .then((value) => {
          msaOwnershipVerified = value;
        })
        .catch((e) => console.log(e));
    }
  }

  onMount(() => {
    checkExpiration();
  });

  onDestroy(() => {
    timeoutId && clearTimeout(timeoutId);
  });
</script>

<div class="flex">
  <div class=" flex-col items-center justify-center">
    <div class="pb-4"><span class="text-xl font-bold">Sign-in Payload</span></div>
    <div class="pb-4"><pre>{message}</pre></div>
    <div class="pb-4"><span class="text-xl font-bold">Signature:</span></div>
    <div class="pb-4"><pre>{signature}</pre></div>
    <div class="flex">
      <Icon icon="openmoji:check-mark" /><span>Payload valid</span>
    </div>
    <div class="flex">
      {#if signatureVerified}
        <Icon icon="openmoji:check-mark" /><span>Signature verified</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>Signature invalid</span>
        {#if isExpired}
          <Icon icon="openmoji:cross-mark" /><span>Signature expired</span>
        {/if}
      {/if}
    </div>
    <div class="flex">
      {#if msaId}
        <Icon icon="openmoji:check-mark" /><span>MSA: {msaId}</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>MSA: undetermined</span>
      {/if}
    </div>
    <div class="flex">
      {#if msaOwnershipVerified}
        <Icon icon="openmoji:check-mark" /><span>MSA control key verified</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>MSA control key invalid</span>
      {/if}
    </div>
  </div>
</div>
