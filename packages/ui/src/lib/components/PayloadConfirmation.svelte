<script lang="ts">
  import { Content, Modal, Trigger } from 'sv-popup';
  import { u8aToHex, u8aWrapBytes } from '@polkadot/util';

  export let isRaw: boolean = false;

  export let payload: string | Uint8Array;

  function formatRawPayload() {
    if (typeof payload === 'string') {
      return payload;
    }

    return u8aToHex(u8aWrapBytes(payload));
  }
</script>

<div>
  <div class="flex items-center justify-center pb-5">
    <slot name="heading" />
  </div>
  <div class="flex items-center justify-center pb-3">
    <slot name="subheading" />
  </div>
  <div class="flex items-center justify-center pb-5">
    <div class="flex h-[400px] w-full flex-col rounded-md border bg-transparent">
      <div class=" overflow-auto bg-transparent p-5">
        <slot name="payloadDescription" />
      </div>
      <!-- PayloadDisplay -->
      <Modal big={true}>
        <Content class="bg-light-blue flex p-3">
          <div class="flex-col">
            <div class="whitespace-pre-wrap">
              The payload you will sign with your wallet should match the payload below:<br /><br />
            </div>
            <div>
              {#if isRaw}
                <pre class="whitespace-pre-wrap">{payload}</pre>
              {:else}
                <pre class=" inline-block overflow-scroll">{formatRawPayload()}</pre>
              {/if}
            </div>
          </div>
        </Content>
        <Trigger>
          <div class="mt-auto flex items-end justify-end pb-4 pr-2 pt-4">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="border-b text-sm font-medium">View Full Payload</a>
          </div>
        </Trigger>
      </Modal>
    </div>
  </div>
</div>
