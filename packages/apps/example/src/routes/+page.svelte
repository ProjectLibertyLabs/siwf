<script lang="ts">
  import { getLoginOrRegistrationPayload } from '@frequency-control-panel/utils';
  let signInResponse: unknown;

  const handleSignIn = async () => {
    signInResponse = await getLoginOrRegistrationPayload();
  };

  let signatures: Record<string, unknown> = {};
</script>

<div class="p-12 text-violet-300">
  <h1 class="text-3xl">Welcome to ACME!</h1>
  <button class="btn-primary bg-violet-400" on:click|preventDefault={handleSignIn} disabled={false}>
    Login with Frequency Connect
  </button>
  <div class="mt-12">
    <p class="text-2xl">Signature data:</p>
    {#if signatures?.handle}
      {#each Object.keys(signatures) as key}
        <p>{key}: {signatures[key]}</p>
      {/each}
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
  <div>
	{signInResponse && JSON.stringify(signInResponse)}
  </div>
</div>
