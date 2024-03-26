<script lang="ts">
  import Icon from '@iconify/svelte';
  import { isValidControlKey, isValidExpiration, isValidSignature, type SiwsMessage } from '@amplica-labs/siwf';
  import { onDestroy, onMount } from 'svelte';
  import type { ApiPromise } from '@polkadot/api';

  export let siwsMessage: SiwsMessage;
  export let message: string;
  export let signature: string;
  export let api: ApiPromise;
  const baseTimeoutSecs = 3;

  let signatureVerified: boolean = false;
  let msaId: string;
  let msaOwnershipVerified = false;
  let timeoutId: number;
  let backoff = 0;
  let isExpired: boolean;

  function checkExpiration() {
    isExpired = !isValidExpiration(siwsMessage);
    console.log(`Payload is ${isExpired ? 'expired' : 'not expired'}`);
    const timeout = Math.pow(baseTimeoutSecs, ++backoff) * 1_000;
    if (!isExpired) {
      timeoutId = setTimeout(checkExpiration, timeout) as unknown as number;
    }
  }

  $: {
    isValidSignature(siwsMessage.address, { signature, message }).then((x) => (signatureVerified = x));
    isValidControlKey(api, siwsMessage).then((x) => {
      msaOwnershipVerified = x !== null;
      if (x !== null) {
        msaId = x;
      }
    });
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
      {/if}
      {#if !signatureVerified && isExpired}
        <div class="flex">
          <Icon icon="openmoji:cross-mark" /><span>Signature expired</span>
        </div>
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
