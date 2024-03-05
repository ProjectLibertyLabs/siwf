<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';
  import FrequencyLogo from '$lib/icons/FrequencyLogo.svelte';
  import {
    getProviderRegistryInfo,
    resolveSchemas,
    setApiUrl,
    type SignInRequest,
  } from '@frequency-control-panel/utils';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { page } from '$app/stores';
  import { getWindowEndpoint } from '$lib/utils';

  async function handleSigninPayload(e: CustomEvent) {
    setApiUrl($page.url.searchParams.get('frequencyRpcUrl'));
    const payload = e.detail as SignInRequest;
    await resolveSchemas(payload.requiredSchemas!);
    const providerName = await getProviderRegistryInfo(payload.providerId);
    RequestResponseStore.set({
      request: { ...payload, isNewProvider: true, providerName, missingSchemas: [], allSchemasToGrant: [] },
    });
  }

  onMount(() => {
    resolveInjectedWeb3(window.injectedWeb3);
    if (window.opener) {
      getWindowEndpoint()
        .then((endpoint) => {
          endpoint.on('signinPayload', handleSigninPayload);
        })
        .catch((e) => console.error(e));
    }
  });
</script>

<div class="absolute left-0 top-0 h-[355px] w-[100%] bg-white bg-opacity-50" id="bgmask" />
<div class="container mx-auto h-[600px] w-[380px]">
  <div class="items-center justify-center">
    <div class="flex items-center justify-center pb-[60px] pt-[60px]">
      <svelte:component this={FrequencyLogo} />
    </div>
    <slot />
  </div>
</div>
