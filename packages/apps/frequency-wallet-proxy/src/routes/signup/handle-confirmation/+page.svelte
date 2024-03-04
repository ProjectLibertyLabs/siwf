<script lang="ts">
  import { FooterButton, PayloadConfirmation } from '$lib/components';
  import type { PayloadSummaryItem } from '$lib/components/PayloadConfirmation.svelte';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { getHandlePayload, getPayloadSignature } from '$lib/utils';
  import { buildHandleTx } from '@frequency-control-panel/utils';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let payload: Awaited<ReturnType<typeof getHandlePayload>>;
  let payloadSummary: PayloadSummaryItem[];

  $: payload = $SignupStore.handle.payload;

  $: payloadSummary = [
    {
      name: 'Operation',
      content: 'claimHandle',
    },
    {
      name: 'baseHandle',
      content: payload?.raw.baseHandle,
    },
    {
      name: 'expiration',
      content: `${payload?.raw.expiration} blocks`,
    },
  ];

  async function handleHandle() {
    try {
      const signature = await getPayloadSignature(
        $CurrentSelectedExtensionIdStore,
        $SignupStore.address,
        payload.bytes
      );

      const encodeClaimHandleTx = (
        await buildHandleTx(
          $SignupStore.address,
          {
            Sr25519: signature.toString(),
          },
          payload.bytes
        )
      ).toHex();

      RequestResponseStore.upsertExtrinsic({
        pallet: 'handles',
        extrinsicName: 'claimHandle',
        encodedExtrinsic: encodeClaimHandleTx,
      });

      console.dir({ msg: 'Signature', signature, tx: encodeClaimHandleTx });

      goto(`${base}/signup/create_account`);
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation items={payloadSummary} payload={payload.bytes}>
  <span slot="heading" class="text-md font-bold">Here is what you are going to sign</span>
  <span slot="subheading">Make sure to come back</span>
</PayloadConfirmation>
<FooterButton on:click={handleHandle}>Next > Sign</FooterButton>
