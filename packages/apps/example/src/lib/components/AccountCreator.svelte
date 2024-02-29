<script lang="ts">
  import { onMount } from 'svelte';
  import { ExtrinsicHelper } from 'frequency-scenario-template/dist';
  import { Keyring } from '@polkadot/api';

  export let payload: any;

  let accountCreationResponse: Error;

  const PROVIDER_MNEMONIC = 'lounge monster rotate olympic grass correct potato pumpkin inside scissors lucky vote';
  const keyring = new Keyring({ type: 'sr25519' });
  const keys = keyring.addFromMnemonic(PROVIDER_MNEMONIC);

  onMount(async () => {
    if (payload.createAccountExtrinsic) {
      await ExtrinsicHelper.payWithCapacity(payload.createAccountExtrinsic, keys).signAndSend();
    }

    if (payload.claimHandleExtrinsic) {
      await ExtrinsicHelper.payWithCapacity(payload.claimHandleExtrinsic, keys).signAndSend();
    }
  });
</script>
