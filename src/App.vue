<template>
  <GlobalOverlay />
  <GlobalAlert />
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalAlert from './components/shared/GlobalAlert.vue';
import GlobalOverlay from '@/components/shared/GlobalOverlay.vue';
</script>
