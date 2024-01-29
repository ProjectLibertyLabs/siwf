<script lang="ts">
  import { SignupStore } from '$lib/store';
  import { validateHandle } from '@frequency-control-panel/utils';

  let timeoutId: number | undefined;
  let isValidHandle = false;

  async function hasValidHandle() {
    isValidHandle = await validateHandle($SignupStore.handle);
  }

  function handleKeyup(_event: KeyboardEvent) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(hasValidHandle, 500) as unknown as number;
  }

  function handleInput(_event: InputEvent) {
    $SignupStore.handle = $SignupStore.handle.replaceAll(' ', '');
    $SignupStore.handle = $SignupStore.handle.replaceAll('.', '');
  }
</script>

<div>Choose Handle</div>

<div>
  <input type="text" bind:value={$SignupStore.handle} on:keyup={handleKeyup} on:input={handleInput} maxlength="20" />
</div>
isValid: {isValidHandle}
SignupStore: {JSON.stringify($SignupStore)}
