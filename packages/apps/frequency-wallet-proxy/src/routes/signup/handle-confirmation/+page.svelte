<script lang="ts">
  import { FooterButton, PayloadConfirmation } from '$lib/components';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { getHandlePayload, getPayloadSignature } from '$lib/utils';
  import { buildHandleTx } from '@frequency-control-panel/utils';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let payload: Awaited<ReturnType<typeof getHandlePayload>>;

  $: payload = $SignupStore.handle.payload;

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

      goto(`${base}/signup/create-account`);
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation payload={payload.bytes}>
  <span slot="heading" class="text-md font-bold">Here is what you are going to sign</span>
  <span slot="subheading">Make sure to come back</span>
  <div slot="payloadDescription">
    <div class="text-sm font-bold">Operation:</div>
    <div class="text-sm font-normal">Claim Handle</div>
    <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
    <div class="text-sm font-bold">Handle:</div>
    <div class="text-sm font-normal">{payload.raw.baseHandle}</div>
  </div>
</PayloadConfirmation>
<FooterButton on:click={handleHandle}>Next > Sign</FooterButton>
