<script lang="ts">
  import type { ISubmittableResult } from '@polkadot/types/types';
  import type { EventRecord as PolkadotEventRecord } from '@polkadot/types/interfaces';
  import '@frequency-chain/api-augment';
  import { onMount } from 'svelte';
  import { Keyring } from '@polkadot/api';
  import { getApi, type SignUpResponse } from '@frequency-control-panel/utils';
  import type { ApiPromise } from '@polkadot/api/promise';
  import Spinner from './Spinner.svelte';

  export let payload: SignUpResponse;

  let api: ApiPromise;
  let isWaiting = true;
  let events: PolkadotEventRecord[] = [];
  let error: Error;

  const PROVIDER_MNEMONIC = 'lounge monster rotate olympic grass correct potato pumpkin inside scissors lucky vote';
  const keyring = new Keyring({ type: 'sr25519' });
  const keys = keyring.addFromMnemonic(PROVIDER_MNEMONIC);

  onMount(async () => {
    api = await getApi('ws://127.0.0.1:9944');
    const transactions: `0x${string}`[] = [];
    // Execute 'msa' pallet extrinsics before other pallets (ie, handles)
    payload.extrinsics
      ?.filter((e) => e.pallet === 'msa')
      .forEach((e) => {
        transactions.push(e.encodedExtrinsic);
      });
    payload.extrinsics
      ?.filter((e) => e.pallet !== 'msa')
      .forEach((e) => {
        transactions.push(e.encodedExtrinsic);
      });
    if (transactions.length > 0) console.log('Creating account');
    const txns = transactions.reverse().map((t) => api.tx(t));
    const vec = api.registry.createType('Vec<Call>', txns);
    const createAccountTx = api.tx.frequencyTxPayment.payWithCapacityBatchAll(vec);
    const unsub = await createAccountTx.signAndSend(keys, (result: ISubmittableResult) => {
      console.dir(result);
      if (result.dispatchError) {
        let message: string;
        if (result.dispatchError.isModule) {
          const decoded = result.dispatchError.registry.findMetaError(result.dispatchError.asModule);
          message = decoded.docs.join(' ');
        } else {
          message = result.dispatchError.type;
        }
        error = new Error(message);
        isWaiting = false;
      }

      if (result.status.isFinalized) {
        events = result.events;
        isWaiting = false;
        unsub();
      }
    });
  });
</script>

<div class="flex">Creating account</div>
{#if error}
  <div class="flex pb-3 font-bold">{error}</div>
{/if}
{#each events as event}
  <div class="flex flex-col pb-3">
    <div class="flex">
      <span class="font-semibold">{event.event.method || ''}</span>
    </div>
    <div class="flex">
      <pre>{JSON.stringify(event.event.data, (_, value) => value, 3)}</pre>
    </div>
  </div>
{/each}
{#if isWaiting}
  <Spinner />
{/if}
