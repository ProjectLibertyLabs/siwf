<script lang="ts">
  import { SignupStore } from '$lib/stores/SignupStore';
  import { HandleStore } from '$lib/stores/HandleStore';
  import { goto } from '$app/navigation';
  import HandleInput from '$lib/components/HandleInput.svelte';
  import AddressDropdown from '$lib/components/AddressDropdown.svelte';

  let isNextDisabled: boolean = true;

  $: {
    isNextDisabled = !$SignupStore.address || !$HandleStore.isValid || !$HandleStore.isAvailable;
  }
</script>

<div>
  <div>Sign up</div>
  <div>
    <div>Choose an address you want to create an account with</div>
    <div>
      <AddressDropdown />
    </div>

    <div>choose your handle</div>
    <div>
      <HandleInput />
    </div>

    <div>
      <button on:click={() => goto('/signin')}>back</button>
      <button on:click={() => goto('/signup/handle-confirmation')} disabled={isNextDisabled}>next</button>
    </div>
  </div>
</div>
