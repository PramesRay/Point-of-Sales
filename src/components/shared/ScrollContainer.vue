<template>
  <div
    class="scroll-container"
    :style="{
      maxHeight,
      minHeight,
      overflowY: 'auto',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  maxHeight?: string
  minHeight?: string
}>()
</script>

<style scoped>
.scroll-container {
  position: relative;
}

/* Sembunyikan scrollbar default */
.scroll-container::-webkit-scrollbar {
  width: 6px;
}

/* Scrollbar thumb */
.scroll-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.scroll-container:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

</style>
