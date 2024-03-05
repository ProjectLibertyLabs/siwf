<script lang="ts">
  import {
    getLoginOrRegistrationPayload,
    type SignUpResponse,
    type WalletProxyResponse,
  } from '@frequency-control-panel/utils';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import { parseMessage, SiwsMessage } from '@talismn/siws';
  import AccountCreator from '$lib/components/AccountCreator.svelte';

  let signInResponse: WalletProxyResponse | undefined;
  let signInPayload: SiwsMessage;
  let signature: `0x${string}`;

  let signUpPayload: SignUpResponse;

  const handleSignIn = async () => {
    signInResponse = undefined;
    signInResponse = await getLoginOrRegistrationPayload();
  };

  $: {
    console.dir(signInResponse);
    if (signInResponse?.signIn?.siwsPayload?.message && signInResponse?.signIn?.siwsPayload?.signature) {
      try {
        // signInPayload = new SiwsMessage(signInResponse.siwsPayload.message as unknown as any);
        signInPayload = parseMessage(signInResponse.signIn.siwsPayload.message);
        console.dir(signInPayload);
        signature = signInResponse.signIn.siwsPayload.signature;
      } catch (e) {
        console.error(e);
      }
    }
    if (signInResponse?.signUp) {
      signUpPayload = signInResponse.signUp;
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
    {#if signInResponse}
      {#if signInPayload}
        <SignInVerification payload={signInPayload} {signature} />
      {/if}
      {#if signUpPayload}
        <AccountCreator payload={signUpPayload} />
      {/if}
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
</div>
