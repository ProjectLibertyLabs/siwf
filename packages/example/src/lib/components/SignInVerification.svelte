<script lang="ts">
  import { parseMessage, type SiwsMessage } from '@talismn/siws';
  import Icon from '@iconify/svelte';
  import type { SignInResponse, SiwsPayload } from '@AmplicaLabs/siwf';
  import type { ApiPromise } from '@polkadot/api';
  import SignInVerificationDetails from './SignInVerificationDetails.svelte';

  export let response: SignInResponse;
  export let api: ApiPromise;
  let siwsMessage: SiwsMessage | null;

  function parsePayload(p: SiwsPayload): SiwsMessage | null {
    try {
      return parseMessage(p.message);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  $: siwsMessage = (response.siwsPayload && parsePayload(response.siwsPayload)) || null;
  $: message = response.siwsPayload?.message || '';
  $: signature = response.siwsPayload?.signature || '0x';
</script>

<div class="flex">
  {#if siwsMessage}
    <SignInVerificationDetails {message} {signature} {siwsMessage} {api} />
  {/if}
  {#if response.error || siwsMessage === null}
    <div class=" flex-col items-center justify-center">
      <div class="pb-4"><span class="text-xl font-bold">Message Error</span></div>
      <div class="pb-4"><pre>{response.error || 'Unknown error'}</pre></div>
      <div class="flex">
        <Icon icon="openmoji:cross-mark" /><span>Payload invalid</span>
      </div>
    </div>
  {/if}
</div>
