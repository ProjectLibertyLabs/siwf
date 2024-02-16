<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div>Delegation Page</div>

<div>
  <button on:click={() => goto('/signup/handle')}>back</button>
  <button on:click={() => goto('/delegation')}>next</button>
</div>
