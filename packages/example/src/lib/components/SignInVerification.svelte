<script lang="ts">
  import Icon from '@iconify/svelte';
  import { parseMessage, type SignInResponse, type SiwsMessage } from '@projectlibertylabs/siwf';
  import type { ApiPromise } from '@polkadot/api';
  import SignInVerificationDetails from './SignInVerificationDetails.svelte';

  export let response: SignInResponse;
  export let api: ApiPromise;
  let siwsMessage: SiwsMessage | null;

  // This breaks apart the pieces of `validateSignin` to get to the details of the failures
  function parseResponse(p: SignInResponse): SiwsMessage | null {
    try {
      if (p.siwsPayload?.message) {
        return parseMessage(p.siwsPayload.message);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  $: siwsMessage = parseResponse(response) || null;
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
