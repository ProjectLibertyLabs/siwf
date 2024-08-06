<script lang="ts">
  import {
    type Config,
    defaultConfig,
    getLoginOrRegistrationPayload,
    type RequestedSchema,
    setConfig,
    type WalletProxyResponse,
  } from '@projectlibertylabs/siwf';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import AccountCreator from '$lib/components/AccountCreator.svelte';
  import { MultiSelect, type ObjectOption, type Option } from 'svelte-multiselect';
  import { schemas } from '@dsnp/frequency-schemas/dsnp';
  import Spinner from '../lib/components/Spinner.svelte';
  import type { ApiPromise } from '@polkadot/api';
  import { getApi, setApiUrl } from '@projectlibertylabs/siwf-utils';

  if (process.env.BUILD_TARGET === 'production') {
    setConfig({
      proxyUrl: 'https://projectlibertylabs.github.io/siwf/ui',
      frequencyRpcUrl: 'https://0.rpc.frequency.xyz',
    });
  }

  type ChainUrl = {
    name: string;
    http: string;
    ws: string;
  };

  const CHAIN_URLS: ChainUrl[] = [
    {
      name: 'Local dev node',
      http: 'http://127.0.0.1:9944',
      ws: 'ws://127.0.0.1:9944',
    },
    {
      name: 'Mainnet #1',
      http: 'https://0.rpc.frequency.xyz',
      ws: 'wss://0.rpc.frequency.xyz',
    },
    {
      name: 'Mainnet #2',
      http: 'https://1.rpc.frequency.xyz',
      ws: 'wss://1.rpc.frequency.xyz',
    },
    {
      name: 'Mainnet Dwellir',
      http: 'https://frequency-rpc.dwellir.com',
      ws: 'wss://frequency-rpc.dwellir.com',
    },
    {
      name: 'Mainnet OnFinality',
      http: 'https://frequency-polkadot.api.onfinality.io/public-http',
      ws: 'wss://frequency-polkadot.api.onfinality.io/public-ws',
    },
    {
      name: 'Frequency Paseo',
      http: 'https://0.rpc.testnet.amplica.io',
      ws: 'wss://0.rpc.testnet.amplica.io',
    },
    {
      name: 'Frequency Rococo',
      http: 'https://rpc.rococo.frequency.xyz',
      ws: 'wss://rpc.rococo.frequency.xyz',
    },
  ];

  type ProxyUrl = {
    name: string;
    url: string;
  };

  const PROXY_URLS: ProxyUrl[] = [
    {
      name: 'Localhost',
      url: 'http://localhost:5173',
    },
    {
      name: 'Production',
      url: 'https://projectlibertylabs.github.io/siwf/ui',
    },
  ];

  let chainUrl: ChainUrl;
  let loginUrl: ProxyUrl;
  let expirationSeconds: number = 300;
  let requestedSchemas: Option[] = defaultConfig.schemas.map((s) => ({
    ...s,
    label: s.name,
    value: s.name,
  }));
  let options = [...schemas.keys()];
  let providerId: string = '1';
  let isFetchingPayload = false;
  let api: ApiPromise;

  let walletProxyResponse: WalletProxyResponse | undefined;

  const handleSignIn = async () => {
    const config: Partial<Config> = {
      providerId: providerId.toString(),
      frequencyRpcUrl: chainUrl.http,
      proxyUrl: loginUrl.url,
      schemas: requestedSchemas.map((option) => {
        const { label: _label, value: _value, ...s } = option as unknown as ObjectOption;
        return { ...s } as RequestedSchema;
      }),
      siwsOptions: {
        expiresInMsecs: expirationSeconds * 1_000,
      },
    };
    setConfig(config);
    setApiUrl(chainUrl.ws);
    api = await getApi();
    walletProxyResponse = undefined;
    isFetchingPayload = true;
    walletProxyResponse = await getLoginOrRegistrationPayload();
    isFetchingPayload = false;
  };
</script>

<div class="p-12 text-violet-300">
  <h1 class="text-3xl">Welcome to ACME!</h1>
  <button class="btn-primary bg-violet-400" on:click|preventDefault={handleSignIn} disabled={false}>
    Login with Frequency
  </button>
  <div class="grid grid-cols-2">
    <label for="chainselect">Select a Frequency chain</label>
    <select id="chainselect" bind:value={chainUrl}>
      {#each CHAIN_URLS as chain}
        <option value={chain}>{chain.name}</option>
      {/each}
    </select>
    <label for="proxyurl">Select a login URL</label>
    <select id="proxyurl" bind:value={loginUrl}>
      {#each PROXY_URLS as url}
        <option value={url}>{url.name}</option>
      {/each}
    </select>
    <label for="provider-id">Provider ID</label>
    <input id="provider-id" type="number" placeholder="1" bind:value={providerId} />
    <label for="expiration">Login payload expiration (seconds)</label>
    <input type="text" placeholder="300" bind:value={expirationSeconds} />
    <label for="schemas">Requested schemas</label>
    <MultiSelect bind:selected={requestedSchemas} {options}></MultiSelect>
  </div>
  <div class="mt-12">
    <h1 class="text-2xl">Signup/Login Response Payload</h1>
    {#if isFetchingPayload}
      <Spinner />
    {/if}
    {#if !isFetchingPayload && walletProxyResponse}
      <pre>{JSON.stringify(walletProxyResponse, null, 4)}</pre>
    {/if}
  </div>
  <div class="mt-12">
    {#if walletProxyResponse}
      {#if walletProxyResponse.signIn}
        <SignInVerification response={walletProxyResponse.signIn} {api} />
      {/if}
      {#if walletProxyResponse.signUp}
        <AccountCreator response={walletProxyResponse.signUp} {api} {providerId} />
      {/if}
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
</div>
