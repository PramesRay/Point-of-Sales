<script setup lang="ts">
import { useUser } from '@/composables/useUser';
import { computed, onMounted } from 'vue';
import { hasRole } from '@/utils/helpers/user';
import { defineAsyncComponent } from 'vue';

// Ambil data pengguna
const { data: me, loading: lu, fetchMe } = useUser();

// Ambil role pengguna dari data `me`
onMounted(() => {
  fetchMe();
});

// Berdasarkan role, tentukan halaman yang akan ditampilkan
const selectedComponent = computed(() => {
  // Ganti dengan logika peran pengguna yang sesuai
  if (me.value && hasRole(me.value, ['admin'])) {
    return defineAsyncComponent(() => import('@/views/dashboards/owner/OwnerDashboard.vue'));
  } else if (me.value && hasRole(me.value, ['cashier'])) {
    return defineAsyncComponent(() => import('@/views/pages/cashier/CashierPage.vue'));
  } else if (me.value && hasRole(me.value, ['inventory'])) {
    return defineAsyncComponent(() => import('@/views/pages/inventory/InventoryPage.vue'));
  } else if (me.value && hasRole(me.value, ['kitchen'])) {
    return defineAsyncComponent(() => import('@/views/pages/kitchen/KitchenPage.vue'));
  } else {
    return defineAsyncComponent(() => import('@/views/StarterPage.vue')); // Default pag)e
  }
});
</script>

<template>
  <v-progress-circular v-if="lu" indeterminate color="primary" class="mx-auto my-auto"></v-progress-circular>
  <!-- <component v-else :is="selectedComponent" /> -->
</template>
