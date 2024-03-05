<script lang="ts">
  import {
    defaultConfig,
    getLoginOrRegistrationPayload,
    type SignUpResponse,
    setConfig,
    type Config,
    type WalletProxyResponse,
  } from '@frequency-control-panel/utils';
  import SignInVerification from '$lib/components/SignInVerification.svelte';
  import { parseMessage, SiwsMessage } from '@talismn/siws';
  import AccountCreator from '$lib/components/AccountCreator.svelte';
  import { MultiSelect, type Option } from 'svelte-multiselect';
  import { schemas, type SchemaName } from '@dsnp/frequency-schemas/dsnp';

  if (process.env.BUILD_TARGET === 'production') {
    setConfig({
      proxyUrl: 'https://amplicalabs.github.io/frequency-control-panel/wallet-proxy',
      frequencyRpcUrl: 'https://rpc.rococo.frequency.xyz',
    });
  }

  let walletProxyResponse: WalletProxyResponse | undefined;
  let signInPayload: SiwsMessage;
  let signature: `0x${string}`;

  const CHAIN_URLS = [
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
      name: 'Rococo',
      http: 'https://rpc.rococo.frequency.xyz',
      ws: 'wss://rpc.rococo.frequency.xyz',
    },
    {
      name: 'Local dev node',
      http: 'http://127.0.0.1:9944',
      ws: 'ws://127.0.0.1:9944',
    },
  ];

  const PROXY_URLS = [
    {
      name: 'Production',
      url: 'https://amplicalabs.github.io/frequency-control-panel/wallet-proxy',
    },
    {
      name: 'Localhost',
      url: 'http://localhost:5173',
    },
  ];

  let chainUrl: any;
  let loginUrl: any;
  let expirationSeconds: number = 300;
  let requestedSchemas: Option[] = defaultConfig.schemas.map((s) => ({ label: s.name, value: s.name, id: s.id }));
  let options = [...schemas.keys()];

  let signUpPayload: SignUpResponse;

  const handleSignIn = async () => {
    const config: Partial<Config> = {
      frequencyRpcUrl: chainUrl.http,
      proxyUrl: loginUrl.url,
      schemas: requestedSchemas.map((option) => ({ name: option.toString() as SchemaName, id: 0 })),
      siwsOptions: {
        expiresInMsecs: expirationSeconds * 1_000,
      },
    };
    setConfig(config);
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
    <label for="expiration">Login payload expiration (seconds)</label>
    <input type="text" placeholder="300" bind:value={expirationSeconds} />
    <label for="schemas">Requested schemas</label>
    <MultiSelect bind:selected={requestedSchemas} {options}></MultiSelect>
  </div>
  <div class="mt-12">
    {#if walletProxyResponse}
      {#if signInPayload}
        <SignInVerification payload={signInPayload} {signature} />
      {/if}
      {#if signUpPayload}
        <AccountCreator payload={signUpPayload} chainUrl={chainUrl.ws} />
      {/if}
    {:else}
      <p class="mt-4">Please click 'Login'</p>
    {/if}
  </div>
</div>
