<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { debounce } from '$lib/utils';
  import { onMount } from 'svelte';

  let handle: string;

  const debouncedHandleValidation = debounce(hasValidHandle, 500);

  async function hasValidHandle() {
    SignupStore.validateAndSetHandleStatus(handle);
  }

  function handleKeyup() {
    debouncedHandleValidation();
  }

  /** @param {Event & {currentTarget: EventTarget & HTMLInputElement} & {target: HTMLInputElement} & InputEvent} event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (event: any) => {
    const whitespaceAndDotRegex = /\s|\./g;
    handle = (event?.target as HTMLInputElement).value.replace(whitespaceAndDotRegex, '') || '';
    SignupStore.updateHandle(handle);
  };

  onMount(() => {
    handle = $SignupStore.handle.baseHandle;
  });
</script>

<input
  class="transparent-text text-white"
  type="text"
  bind:value={handle}
  on:keyup={handleKeyup}
  on:input={handleInput}
  maxlength="20"
  placeholder="Enter your handle"
/>
