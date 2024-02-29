<script lang="ts">
  import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
  import { u8aToHex } from '@polkadot/util';
  import { parseJson, type SiwsMessage } from '@talismn/siws';
  import Icon from '@iconify/svelte';
  import { doesPublicKeyControlMsa } from '@frequency-control-panel/utils';

  export let payload: SiwsMessage;
  export let signature: `0x${string}`;
  let signatureVerified: boolean = false;
  let payloadValid: boolean = false;
  let msaId: string;
  let msaOwnershipVerified = false;

  const isValidSignature = (signedMessage: string, signature: `0x${string}`, address: string) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);

    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  };

  $: try {
    signatureVerified = isValidSignature(payload.prepareMessage(), signature, payload.address);
  } catch (e) {
    signatureVerified = false;
  }

  $: try {
    const p = parseJson(payload.prepareJson());
    payloadValid = true;
  } catch (e) {
    payloadValid = false;
  }

  $: {
    const resources = (payload as unknown as any)['resources'];
    const msaUri = resources?.[0] || '';
    msaId = /([0-9]*)$/.exec(msaUri)?.[1] || '';
    doesPublicKeyControlMsa(msaId, payload.address).then((val) => {
      msaOwnershipVerified = val;
    });
  }
</script>

<div class="flex">
  <div class=" flex-col items-center justify-center">
    <div class="pb-4"><span class="text-xl font-bold">Sign-in Payload</span></div>
    <div class="pb-4"><pre>{payload.prepareMessage()}</pre></div>
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
      {#if msaId}
        <Icon icon="openmoji:check-mark" /><span>MSA control key verified</span>
      {:else}
        <Icon icon="openmoji:cross-mark" /><span>MSA control key invalid</span>
      {/if}
    </div>
  </div>
</div>
