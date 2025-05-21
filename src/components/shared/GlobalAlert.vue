<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();
</script>

<template>
  <div class="global-alert-wrapper">
    <v-alert
      v-for="alert in alertStore.alerts"
      :key="alert.id"
      :type="alert.type"
      border
      closable
    >
      {{ alert.message }}
      <template v-if="alert.count > 1">
        &nbsp;(<strong>x{{ alert.count }}</strong>)
      </template>
      <template 
        #close
        >
        <v-btn
          icon
          variant="text"
          size="x-small"
          @click="alertStore.alerts = alertStore.alerts.filter(a => a.id !== alert.id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-alert>
  </div>
</template>
<style scoped>
.global-alert-wrapper {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 600px;
  pointer-events: none;
  transition: ease-in-out ;
}
.v-alert {
  pointer-events: auto;
}
</style>