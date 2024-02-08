<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { getHandleNextSuffixes, validateHandle } from '@frequency-control-panel/utils';

  let timeoutId: number | undefined;
  let isValidHandle = false;
  let isHandleAvailable: boolean | undefined = undefined;

  async function hasValidHandle() {
    const minAvailableHandles = 5;
    let res = await getHandleNextSuffixes($SignupStore.handle, minAvailableHandles);
    isHandleAvailable = res.suffixes.length >= minAvailableHandles;
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
isHandleAvailable: {isHandleAvailable}
SignupStore: {JSON.stringify($SignupStore)}
