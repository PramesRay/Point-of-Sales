<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();
</script>

<template>
  <v-alert
      v-for="(alert, index) in alertStore.alerts"
      :key="index"
      :type="alert.type"
      border
      closable
      @click:close="alertStore.alerts.splice(index, 1)"
    >
      {{ alert.message }}
    </v-alert>
</template>