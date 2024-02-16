<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { HandleStore } from '$lib/stores/HandleStore';
  import { debounce } from '$lib/utils';

  const debouncedHandleValidation = debounce(hasValidHandle, 500);

  async function hasValidHandle() {
    HandleStore.validateAndSet($SignupStore.handle);
  }

  function handleKeyup(_event: KeyboardEvent) {
    debouncedHandleValidation();
  }

  function handleInput() {
    const whitespaceAndDotRegex = /\s|\./g;
    SignupStore.updateHandle($SignupStore.handle.replace(whitespaceAndDotRegex, ''));
  }
</script>

<input
  type="text"
  bind:value={$SignupStore.handle}
  on:keyup={handleKeyup}
  on:input={(_event) => handleInput()}
  maxlength="20"
/>
isValid: {$HandleStore.isValid}
isHandleAvailable: {$HandleStore.isAvailable}
SignupStore: {JSON.stringify($SignupStore)}
