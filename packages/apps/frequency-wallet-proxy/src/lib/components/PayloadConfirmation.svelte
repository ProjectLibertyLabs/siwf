<script lang="ts" context="module">
  export type PayloadSummaryItem = {
    name?: string;

    // NOTE: content can be HTML (we use the Svelte {@html ...} tag to render it).
    //       This is a workaround for the fact that you can't dynamically iterate/build up
    //       slot content in Svelte. It's "safe", because we control the content being rendered;
    //       ie, everything comes from hard-coded app strings, chain constants or domain name, no
    //       user-generated content or other request parameters.
    content?: string;
  };
</script>

<script lang="ts">
  import { Content, Modal, Trigger } from 'sv-popup';
  import { u8aToHex, u8aWrapBytes } from '@polkadot/util';

  export let items: PayloadSummaryItem[] = [];
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
    <div class="flex h-[470px] w-full flex-col rounded-md border bg-transparent">
      <div class=" overflow-auto bg-transparent p-5">
        {#each items as payloadItem, index}
          {#if index > 0}
            <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
          {/if}
          {#if payloadItem?.name}
            <div>
              <span class="text-sm font-bold">{payloadItem.name.replace(/:*$/, ':')}</span>
            </div>
          {/if}
          {#if payloadItem?.content}
            <div>
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <span class="text-sm font-normal">{@html payloadItem.content}</span>
            </div>
          {/if}
        {/each}
      </div>
      <!-- PayloadDisplay -->
      <Modal basic big={true}>
        <Content class="bg-bgGradient flex">
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
