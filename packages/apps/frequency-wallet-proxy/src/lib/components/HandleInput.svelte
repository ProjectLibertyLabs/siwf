<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { HandleStore } from '$lib/stores/HandleStore';
  import { debounce } from '$lib/utils';

  let handle: string;

  const debouncedHandleValidation = debounce(hasValidHandle, 500);

  async function hasValidHandle() {
    HandleStore.validateAndSet(handle);
  }

  function handleKeyup() {
    debouncedHandleValidation();
  }

  /** @param {Event & {currentTarget: EventTarget & HTMLInputElement} & {target: HTMLInputElement} & InputEvent} event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (event: any) => {
    const whitespaceAndDotRegex = /\s|\./g;
    handle = event?.target?.value?.replace(whitespaceAndDotRegex, '');
    SignupStore.updateHandle(handle);
  };
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
