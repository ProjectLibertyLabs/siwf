<script lang="ts">
  import { Web3Store } from '$lib/stores';
  import { onMount } from 'svelte';

  onMount(async () => {
    Web3Store.set(window.injectedWeb3);
  });
</script>

<slot />
