<script lang="ts">
  import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
  import { u8aToHex } from '@polkadot/util';
  import { parseMessage, type SiwsMessage } from '@talismn/siws';
  import Icon from '@iconify/svelte';
  import { doesPublicKeyControlMsa, getMsaForAddress } from '@amplicalabs/siwf';
  import { onDestroy, onMount } from 'svelte';
  import type { ApiPromise } from '@polkadot/api';

  export let payload: string;
  export let signature: `0x${string}`;
  export let api: ApiPromise;

  const baseTimeoutSecs = 3;

  let signatureVerified: boolean = false;
  let payloadValid: boolean = false;
  let msaId: string;
  let msaOwnershipVerified = false;
  let timeoutId: number;
  let siwsMessage: SiwsMessage;
  let backoff = 0;

  function isValidSignature(signedMessage: string, signature: `0x${string}`, address: string): boolean {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);

    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  }

  function isPayloadValid(p: string): boolean {
    try {
      siwsMessage = parseMessage(p);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  function isPayloadExpired(p: string): boolean {
    try {
      siwsMessage = parseMessage(p);
      return false;
    } catch (err: any) {
      console.log('Parsing error: ', err?.cause);
      if (err?.cause && /expired/.test(err.cause.message)) {
        return true;
      }
    }

    return false;
  }

  $: try {
    signatureVerified = isValidSignature(payload, signature, siwsMessage.address);
  } catch (e) {
    signatureVerified = false;
  }

  $: payloadValid = isPayloadValid(payload);

  $: {
    // TODO: Need support from SIWS for the 'resources' property
    // const resources = (payload as unknown as any)['resources'];
    // const msaUri = resources?.[0] || '';
    // msaId = /([0-9]*)$/.exec(msaUri)?.[1] || '';
    getMsaForAddress(siwsMessage.address, api).then((value) => {
      msaId = value;
      if (msaId) {
        doesPublicKeyControlMsa(msaId, siwsMessage.address, api).then((val) => {
          msaOwnershipVerified = val;
        });
      }
    });
  }

  function checkExpiration() {
    const isExpired = isPayloadExpired(payload);
    console.log(`Payload is ${isExpired ? 'expired' : 'not expired'}`);
    const timeout = Math.pow(baseTimeoutSecs, ++backoff) * 1_000;
    if (!isExpired) {
      timeoutId = setTimeout(checkExpiration, timeout) as unknown as number;
    }
  }

  onMount(() => {
    checkExpiration();
  });

  onDestroy(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  onDestroy(() => clearInterval(timeoutId));
</script>

<div class="flex">
  <div class=" flex-col items-center justify-center">
    <div class="pb-4"><span class="text-xl font-bold">Sign-in Payload</span></div>
    <div class="pb-4"><pre>{payload}</pre></div>
    <div class="pb-4"><span class="text-xl font-bold">Signature:</span></div>
    <div class="pb-4"><pre>{signature}</pre></div>
    <div class="flex">
      {#if payloadValid}
        <Icon icon="openmoji:check-mark" /><span>Payload valid</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>Payload invalid</span>
      {/if}
    </div>
    <div class="flex">
      {#if signatureVerified}
        <Icon icon="openmoji:check-mark" /><span>Signature verified</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>Signature invalid</span>
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
