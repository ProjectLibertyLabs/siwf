<script lang="ts" context="module">
  export type PayloadSummaryItem = {
    name: string;
    content: string;
  };
</script>

<script lang="ts">
  import { Content, Modal, Trigger } from 'sv-popup';
  import { u8aToHex, u8aWrapBytes } from '@polkadot/util';

  export let items: PayloadSummaryItem[] = [
    { name: 'Message', content: 'Claim your handle' },
    { name: 'URI', content: 'http://localhost.xxy' },
  ];

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
    <span class="text-md font-bold">Here is what you are going to sign</span>
  </div>
  <div class="flex items-center justify-center pb-3">
    <span>Make sure to come back</span>
  </div>
  <div class="flex items-center justify-center pb-5">
    <div class="flex h-[290px] w-full flex-col rounded-md border bg-transparent">
      <div class=" overflow-auto bg-transparent p-5">
        {#each items as payloadItem, index}
          {#if index > 0}
            <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
          {/if}
          <div>
            <span class="text-sm font-bold">{payloadItem.name.replace(/:*$/, ':')}</span>
          </div>
          <div>
            <span class="text-sm font-normal">{payloadItem.content}</span>
          </div>
        {/each}
      </div>
      <!-- PayloadDisplay -->
      <Modal basic big={true}>
        <Content class="bg-bgGradient flex">
          The payload you will sign with your wallet should match the payload below:<br /><br />
          {formatRawPayload()}</Content
        >
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
