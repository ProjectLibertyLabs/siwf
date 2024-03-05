<script lang="ts">
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { DSNPSchemas, getDelegationPayload, getPayloadSignature } from '$lib/utils';
  import { FooterButton } from '$lib/components';
  import PayloadConfirmation, { type PayloadSummaryItem } from '$lib/components/PayloadConfirmation.svelte';
  import { buildGrantDelegationTx } from '@frequency-control-panel/utils';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import { CurrentSelectedMsaAccountStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let payloadBytes: Uint8Array;

  let missingSchemas = $RequestResponseStore.request.requiredSchemas
    .filter(({ id }) => $RequestResponseStore.request.missingSchemas.some((sid) => sid === id))
    .map((schema) => {
      const d = DSNPSchemas.find((ds) => ds.name === schema.name);
      return {
        id: schema.id,
        name: `${schema.name} (${schema.id})`,
        content: d?.description || '',
      };
    });

  let name = $RequestResponseStore.request.isNewProvider
    ? `By clicking "Next" and signing the resulting payload, you grant the provider "${
        $RequestResponseStore.request?.providerName
      }", operating from the domain ${new URL(document.referrer).hostname}, access to your Social Identity to:`
    : `${
        $RequestResponseStore.request?.providerName
      } requires additional permissions. By clicking "Next" and signing the resulting payload, you grant the provider "${
        $RequestResponseStore.request?.providerName
      }", operating from the domain ${new URL(document.referrer).hostname}, access to your Social Identity to:`;

  let items: PayloadSummaryItem[] = [
    {
      name,
      content:
        '<ul style="list-style-type:disc; padding-left:20px; padding-top:5px;">' +
        '<li>Update your Social Identity profile information and Handle</li>' +
        '<li>Create or modify content associated with the following schemas (which may include posting messages or updating your social graph):</li>' +
        '</ul>',
    },
    ...missingSchemas,
  ];

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

      goto(`${base}/signin/confirm`);
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation payload={payloadBytes} {items}>
  <span slot="heading" class="text-[16px] font-bold"
    >{$RequestResponseStore.request.isNewProvider ? 'Authorize a new Provider' : 'Updated permissions requested'}</span
  >
  <span slot="subheading"
    ><span class="text-[16px] font-semibold">{$CurrentSelectedMsaAccountStore.handle}</span>
  </span></PayloadConfirmation
>
<FooterButton on:click={signDelegationAndPermissions}>Next > Sign</FooterButton>
