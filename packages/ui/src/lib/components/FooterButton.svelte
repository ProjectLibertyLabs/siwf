<script lang="ts">
  export let disabled: boolean = false;
</script>

<div class="flex h-full items-center justify-center">
  <button
    {disabled}
    class=" flex h-[40px] w-[235px] items-center justify-center rounded-[50px] bg-[#1B9EA3] pl-2 pr-2 disabled:bg-[#BCBAC1]"
    on:click
  >
    <span class="text-center text-base font-bold"><slot /></span>
  </button>
</div>
