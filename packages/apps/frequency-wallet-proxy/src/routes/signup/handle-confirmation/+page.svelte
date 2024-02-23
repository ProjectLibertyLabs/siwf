<script lang="ts">
  import { FooterButton, PayloadConfirmation } from '$lib/components';
  import type { PayloadSummaryItem } from '$lib/components/PayloadConfirmation.svelte';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { getHandlePayload, getPayloadSignature } from '$lib/utils';
  import { buildHandleTx } from '@frequency-control-panel/utils';
  import { goto } from '$app/navigation';

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

      const _encodeClaimHandleTx = (
        await buildHandleTx(
          $SignupStore.address,
          {
            Sr25519: signature.toString(),
          },
          payload.bytes
        )
      ).toHex();

      console.dir({ msg: 'Signature', signature, tx: _encodeClaimHandleTx });

      // TODO: store result in SignupStore. Either the signed payload or the encoded extrinsic (not sure which yet)

      goto('/signup/delegation');
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation items={payloadSummary} payload={payload.bytes} />
<FooterButton on:click={handleHandle}>Next > Sign</FooterButton>
