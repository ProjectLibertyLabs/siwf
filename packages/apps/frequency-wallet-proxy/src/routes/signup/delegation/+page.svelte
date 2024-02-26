<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { DSNPSchemas, getDelegationPayload, getPayloadSignature } from '$lib/utils';
  import { FooterButton } from '$lib/components';
  import PayloadConfirmation, { type PayloadSummaryItem } from '$lib/components/PayloadConfirmation.svelte';
  import { buildCreateSponsoredAccountTx, defaultConfig } from '@frequency-control-panel/utils';

  // TODO: read provider ID from SignupStore
  let providerId: string = '1';

  let payloadBytes: Uint8Array;

  // TODO: Read requested schemas from SignupStore, read schema info from @dsnp package
  // and @frequency-control-panel/utils package
  let schemas = defaultConfig.schemas.map((schemaName) => {
    const schema = DSNPSchemas?.[schemaName];
    return {
      // TODO: This should be dynamic
      id: schema.id.mainnet,
      name: `${schemaName} (${schema.id.mainnet})`,
      content: schema.description,
    };
  });
  let items: PayloadSummaryItem[] = [
    {
      name: 'By clicking "Next" and signing the resulting payload, you grant XYZ access to your Social Identity to:',
      content:
        '<ul style="list-style-type:disc; padding-left:20px; padding-top:5px;">' +
        '<li>Update your Social Identity profile information and Handle</li>' +
        '<li>Create or modify content associated with the following schemas (which may include posting messages or updating your social graph):</li>' +
        '</ul>',
    },
    ...schemas,
  ];

  getDelegationPayload(
    providerId,
    schemas.map((s) => s.id)
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

      console.dir({ msg: 'Signature', signature, tx: encodedExtrinsic });

      // TODO: store result in SignupStore. Either the signed payload or the encoded extrinsic (not sure which yet)
    } catch (err: unknown) {
      console.error('Payload not signed', err);
    }
  }
</script>

<PayloadConfirmation payload={payloadBytes} {items}>
  <span slot="heading" class="text-[16px] font-bold">Now you have to sign the permissions</span>
  <span slot="subheading"
    ><span class="text-[16px] font-semibold">{$SignupStore.handle.baseHandle}</span><span
      class="font-medium text-neutral-400">.###</span
    >
  </span></PayloadConfirmation
>
<FooterButton on:click={signDelegationAndPermissions}>Next > Sign</FooterButton>
