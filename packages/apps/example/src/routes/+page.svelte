<script lang="ts">
  import { getLoginOrRegistrationPayload, type ControlPanelResponse, isSignIn } from '@frequency-control-panel/utils';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import { parseMessage, type SiwsMessage } from '@talismn/siws';

  let signInResponse: ControlPanelResponse;
  let signInPayload: SiwsMessage;
  let signature: `0x${string}`;

  const handleSignIn = async () => {
    signInResponse = await getLoginOrRegistrationPayload();
  };

  $: {
    console.dir(signInResponse);
    console.log(`isSignIn: ${isSignIn(signInResponse)}`);
    if (isSignIn(signInResponse)) {
      console.log(`Message: ${signInResponse?.siwsPayload?.message}
Signature: ${signInResponse?.siwsPayload?.signature}`);
    }
    if (isSignIn(signInResponse) && signInResponse?.siwsPayload?.message && signInResponse?.siwsPayload?.signature) {
      try {
        signInPayload = parseMessage(signInResponse.siwsPayload.message);
        signature = signInResponse.siwsPayload.signature;
        console.dir(signInResponse);
        console.log(`Signature: ${signature}`);
      } catch (e) {
        console.error(e);
      }
    }
  }
</script>

<div class="p-12 text-violet-300">
  <h1 class="text-3xl">Welcome to ACME!</h1>
  <button class="btn-primary bg-violet-400" on:click|preventDefault={handleSignIn} disabled={false}>
    Login with Frequency
  </button>
  <div class="mt-12">
    {#if signInPayload}
      <SignInVerification payload={signInPayload} {signature} />
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
</div>
