<script lang="ts">
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { DSNPSchemas, getDelegationPayload, getPayloadSignature, sendWalletProxyResponse } from '$lib/utils';
  import { FooterButton } from '$lib/components';
  import PayloadConfirmation from '$lib/components/PayloadConfirmation.svelte';
  import { buildGrantDelegationTx } from '@projectlibertylabs/siwf-utils';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { CurrentSelectedMsaAccountStore } from '$lib/stores';

  let payloadBytes: Uint8Array;

  let missingSchemas = $RequestResponseStore.request.requiredSchemas
    .filter(({ id }) => $RequestResponseStore.request.missingSchemas.some((sid) => sid === id))
    .map((schema) => {
      const d = DSNPSchemas.find((ds) => ds.name === schema.name);
      return {
        ...schema,
        description: d?.description || `Update data associated with the ${schema.name} schema`,
      };
    });

  getDelegationPayload($RequestResponseStore.request.providerId, $RequestResponseStore.request.allSchemasToGrant).then(
    ({ bytes }) => {
      payloadBytes = bytes;
    }
  );

  async function signDelegationAndPermissions() {
    try {
      const signature = await getPayloadSignature(
        $CurrentSelectedExtensionIdStore,
        $CurrentSelectedMsaAccountStore.account.address,
        payloadBytes
      );

      const encodedExtrinsic = (
        await buildGrantDelegationTx(
          $CurrentSelectedMsaAccountStore.account.address,
          {
            Sr25519: signature.toString(),
          },
          payloadBytes
        )
      ).toHex();

      RequestResponseStore.upsertExtrinsic({
        pallet: 'msa',
        extrinsicName: 'grantDelegation',
        encodedExtrinsic,
      });

      await sendWalletProxyResponse($RequestResponseStore.response!);
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation payload={payloadBytes}>
  <span slot="heading" class="text-[16px] font-bold"
    >{$RequestResponseStore.request.isNewProvider ? 'Authorize a new Provider' : 'Updated permissions requested'}</span
  >
  <span slot="subheading"
    ><span class="text-[16px] font-semibold">{$CurrentSelectedMsaAccountStore.handle}</span>
  </span>
  <div slot="payloadDescription">
    <div>
      <span class="text-base font-bold"
        >By clicking "Next" and signing the resulting payload, you authorize the provider "{$RequestResponseStore
          .request?.providerName}", operating from the domain
        <a class="underline" href={document.referrer}>{new URL(document.referrer).hostname}</a>, to do the following</span
      >
      <ul class=" list-disc pl-6 pt-3">
        {#each missingSchemas as schema}
          <li class="text-base font-normal">{schema.description}</li>
        {/each}
      </ul>
    </div>
  </div>
</PayloadConfirmation>
<FooterButton on:click={signDelegationAndPermissions}>Next > Sign</FooterButton>
