<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { DSNPSchemas, getDelegationPayload, getPayloadSignature } from '$lib/utils';
  import { FooterButton } from '$lib/components';
  import PayloadConfirmation from '$lib/components/PayloadConfirmation.svelte';
  import { buildCreateSponsoredAccountTx } from '@projectlibertylabs/siwf-utils';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { sendWalletProxyResponse } from '$lib/utils';

  let payloadBytes: Uint8Array;

  let schemas = $RequestResponseStore.request.requiredSchemas.map((schema) => {
    const d = DSNPSchemas.find((ds) => ds.name === schema.name);
    return {
      ...schema,
      description: d?.description || `Update data associated with the ${schema.name} schema`,
    };
  });

  getDelegationPayload(
    $RequestResponseStore.request.providerId,
    schemas.map((s) => s.id!)
  ).then(({ bytes }) => {
    payloadBytes = bytes;
  });

  async function signDelegationAndPermissions() {
    try {
      const signature = await getPayloadSignature($CurrentSelectedExtensionIdStore, $SignupStore.address, payloadBytes);

      const encodedExtrinsic = (
        await buildCreateSponsoredAccountTx(
          $SignupStore.address,
          {
            Sr25519: signature.toString(),
          },
          payloadBytes
        )
      ).toHex();

      RequestResponseStore.upsertExtrinsic({
        pallet: 'msa',
        extrinsicName: 'createSponsoredAccountWithDelegation',
        encodedExtrinsic,
      });

      await sendWalletProxyResponse($RequestResponseStore.response!);
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation payload={payloadBytes}>
  <span slot="heading" class="text-[16px] font-bold">Now you have to sign the permissions</span>
  <span slot="subheading"
    ><span class="text-[16px] font-semibold">{$SignupStore.handle.baseHandle}</span><span
      class="font-medium text-neutral-400">.###</span
    >
  </span>
  <div slot="payloadDescription">
    <div>
      <span class="text-base font-bold"
        >By clicking "Next" and signing the resulting payload, you authorize the provider "{$RequestResponseStore
          .request?.providerName}", operating from the domain
        <a class="underline" href={document.referrer}>{new URL(document.referrer).hostname}</a>, to do the following</span
      >
      <ul class=" list-disc pl-6 pt-3">
        <li class=" text-base font-normal">Create a new social identity on your behalf</li>
        {#each schemas as schema}
          <li class="text-base font-normal">{schema.description}</li>
        {/each}
      </ul>
    </div>
  </div>
</PayloadConfirmation>
<FooterButton on:click={signDelegationAndPermissions}>Next > Sign</FooterButton>
