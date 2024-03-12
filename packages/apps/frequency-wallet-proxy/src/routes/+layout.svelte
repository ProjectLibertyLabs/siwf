<script lang="ts">
  import { onMount } from 'svelte';
  import { resolveInjectedWeb3 } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';
  import FrequencyLogo from '$lib/icons/FrequencyLogo.svelte';
  import {
    getApi,
    getApiUrl,
    getChainName,
    getProviderRegistryInfo,
    resolveSchemas,
    setApiUrl,
    type SignInRequest,
  } from '@frequency-control-panel/utils';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { getWindowEndpoint } from '$lib/utils';
  import Spinner from '$lib/components/Spinner.svelte';
  import { Footer } from 'flowbite-svelte';

  async function handleSigninPayload(e: CustomEvent) {
    console.dir(`Received signin request:
${JSON.stringify(e.detail, (_, value) => value, 3)}`);
    const payload = e.detail as SignInRequest;
    setApiUrl(payload.frequencyRpcUrl);
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
<div class="container mx-auto max-w-[412px]">
  <div class="items-center justify-center px-4">
    <div class="flex items-center justify-center pb-[60px] pt-[60px]">
      <svelte:component this={FrequencyLogo} />
    </div>
    {#await getApi()}
      <Spinner />
    {:then}
      <slot />
    {:catch error}
      <p>{error.message}</p>
    {/await}
  </div>
</div>
{#await getChainName() then chainName}
  <Footer class="absolute bottom-0 start-0 z-20 w-full pr-4 pt-4 text-right">
    {#await getApiUrl() then apiUrl}
      <span class="text-xs font-extralight" title={apiUrl}>{chainName}</span>
    {/await}
  </Footer>
{/await}
