<script lang="ts">
  import {
    getLoginOrRegistrationPayload,
    setConfig,
    type SignUpResponse,
    type WalletProxyResponse,
  } from '@frequency-control-panel/utils';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import { parseMessage, SiwsMessage } from '@talismn/siws';
  import AccountCreator from '$lib/components/AccountCreator.svelte';

  if (process.env.BUILD_TARGET === 'production') {
    setConfig({
      proxyUrl: 'https://amplicalabs.github.io/frequency-control-panel/wallet-proxy',
      frequencyRpcUrl: 'https://rpc.rococo.frequency.xyz',
    });
  }

  let walletProxyResponse: WalletProxyResponse | undefined;
  let signInPayload: SiwsMessage;
  let signature: `0x${string}`;

  let signUpPayload: SignUpResponse;

  const handleSignIn = async () => {
    walletProxyResponse = undefined;
    walletProxyResponse = await getLoginOrRegistrationPayload();
  };

  $: {
    if (walletProxyResponse?.signIn?.siwsPayload?.message && walletProxyResponse?.signIn?.siwsPayload?.signature) {
      try {
        // signInPayload = new SiwsMessage(signInResponse.siwsPayload.message as unknown as any);
        signInPayload = parseMessage(walletProxyResponse.signIn.siwsPayload.message);
        signature = walletProxyResponse.signIn.siwsPayload.signature;
      } catch (e) {
        console.error(e);
      }
    }
    if (walletProxyResponse?.signUp) {
      signUpPayload = walletProxyResponse.signUp;
    }
  }
</script>

<div class="p-12 text-violet-300">
  <h1 class="text-3xl">Welcome to ACME!</h1>
  <button class="btn-primary bg-violet-400" on:click|preventDefault={handleSignIn} disabled={false}>
    Login with Frequency
  </button>
  <div class="mt-12">
    {#if walletProxyResponse}
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
