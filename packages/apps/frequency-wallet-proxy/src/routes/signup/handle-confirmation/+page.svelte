<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { CurrentSelectedExtensionIdStore } from '$lib/stores/CurrentSelectedExtensionIdStore';
  import { SignupStore } from '$lib/stores/SignupStore';
  import { getHandlePayloadSignature } from '$lib/utils';
  import { buildHandleTx } from '@frequency-control-panel/utils';

  async function handleHandle() {
    const {
      signature,
      payload: { raw: _raw, bytes },
    } = await getHandlePayloadSignature($CurrentSelectedExtensionIdStore, $SignupStore.address, $SignupStore.handle);

    const _encodeClaimHandleTx = (
      await buildHandleTx(
        $SignupStore.address,
        {
          Sr25519: signature,
        },
        bytes
      )
    ).toHex();
  }
</script>

<div>Here is what your going to sign</div>

<div>
  <div>Message</div>
  <div>Sign for you handle</div>

  <div class="mt-4">
    <div>
      <label for="claimHandle">
        Authorize <span class="font-bold text-white">Acme App</span> to create your handle
      </label>
      <div>
        <button id="claimHandle" on:click|preventDefault={handleHandle}> I Claim </button>
      </div>
    </div>
  </div>
</div>
{$SignupStore.handle}
{$SignupStore.address}
{$CurrentSelectedExtensionIdStore}

<div>
  <button on:click={() => goto(`/signup/handle?${$page.url.searchParams}`)}>back</button>
  <button on:click={() => goto(`/signup/delegation?${$page.url.searchParams}`)}>sign > next</button>
</div>
