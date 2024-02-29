<script lang="ts">
  import {
    type ControlPanelResponse,
    getLoginOrRegistrationPayload,
    isSignIn,
    isSignUp,
    type SignUpResponse,
  } from '@frequency-control-panel/utils';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import { parseMessage, SiwsMessage } from '@talismn/siws';
  import AccountCreator from '$lib/components/AccountCreator.svelte';

  let signInResponse: ControlPanelResponse | undefined;
  let signInPayload: SiwsMessage;
  let signature: `0x${string}`;

  let signUpPayload: SignUpResponse;

  const handleSignIn = async () => {
    signInResponse = undefined;
    signInResponse = await getLoginOrRegistrationPayload();
  };

  $: {
    console.dir(signInResponse);
    if (
      signInResponse &&
      isSignIn(signInResponse) &&
      signInResponse?.siwsPayload?.message &&
      signInResponse?.siwsPayload?.signature
    ) {
      try {
        // signInPayload = new SiwsMessage(signInResponse.siwsPayload.message as unknown as any);
        signInPayload = parseMessage(signInResponse.siwsPayload.message);
        console.dir(signInPayload);
        signature = signInResponse.siwsPayload.signature;
      } catch (e) {
        console.error(e);
      }
    } else if (signInResponse && isSignUp(signInResponse)) {
      signUpPayload = signInResponse;
      console.dir({ signUpPayload });
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
    {:else if signUpPayload}
      <AccountCreator payload={signUpPayload} />
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
</div>
