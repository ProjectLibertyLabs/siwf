<script lang="ts">
  import Icon from '@iconify/svelte';
  import baselineDownload from '@iconify/icons-ic/baseline-download';
  import threeDotsLoading from '@iconify/icons-eos-icons/three-dots-loading';
  import { onMount } from 'svelte';
  import { extensionsConfig } from '$lib/extensionsConfig';
  import type { Extension } from '$lib/extensionsConfig';
  import { onReady, isWalletInstalled, getAccounts } from '$lib/wallet';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { SelectedWalletAccountsStore, SelectedWalletStore, MsaInfoStore } from '$lib/store';
  import { getMsaInfo } from '$lib/chain/util';
  import AmplicaAccess from '$components/icons/AmplicaAccess.svelte';

  export let showSelectAddress;
  let isLoading = false;

  export let extensions: Array<Extension> = [];

  onMount(async () => {
    await onReady();
    extensions = extensionsConfig;
    console.log({ extensions });
  });

  async function handleSelectedWallet(injectedName: string) {
    isLoading = true;

    $SelectedWalletStore = injectedName;
    try {
      $SelectedWalletAccountsStore = await getAccounts(injectedName, $page.data.endpoint);
      $MsaInfoStore = await getMsaInfo($SelectedWalletAccountsStore, $page.data.endpoint);
      if (Object.keys($MsaInfoStore).length !== 0) {
        showSelectAddress = true;
        goto(`${base}/signin?${$page.url.searchParams}`);
      } else {
        goto(`${base}/signup?${$page.url.searchParams}`);
      }
    } catch (error) {
      console.error('problem getting accounts: ', error.message);
    } finally {
      isLoading = false;
    }
  }

  function handleAmplicaAccess() {
    alert('Signing in with Amplica Access...');
  }
</script>

<div class="xs:mx-12 sm:w-500 md:w-800 mx-auto flex flex-col gap-2">
  {#each extensions as extension}
    <button type="button" class="btn-banner font-bold" on:click={() => handleSelectedWallet(extension.injectedName)}>
      <div class="flex items-center justify-center gap-3">
        <div class="basis-3/12">
          <svelte:component this={extension.logo.component} size={extension.logo.size} />
        </div>
        <div class="basis-5/8 ml-8 text-left">
          <div class="text-3xl">{extension.displayName}</div>
          <span class="text-sm italic antialiased">Sign in with {extension.displayName}</span>
        </div>
        <div class="w-4 basis-1/12">
          {#if !isWalletInstalled(extension.injectedName)}
            <Icon icon={baselineDownload} width="30" height="30" />
          {/if}
          {#if isLoading && $SelectedWalletStore === extension.injectedName}
            <Icon icon={threeDotsLoading} width="55" height="55" />
          {/if}
        </div>
      </div>
    </button>
  {/each}
  <div class="mx-auto mt-8 text-4xl">OR</div>
  <button type="button" class="btn-banner font-bold" on:click={() => handleAmplicaAccess()}>
    <div class="flex justify-evenly">
      <AmplicaAccess />
      <div class="my-auto text-2xl">Sign in with Amplica Access</div>
    </div>
  </button>
</div>
