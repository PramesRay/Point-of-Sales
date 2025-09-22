<script setup lang="ts">
import { useUserStore } from '@/stores/authUser';
import { computed, onMounted } from 'vue';
import { defineAsyncComponent } from 'vue';

// Ambil data pengguna
const userStore = useUserStore();

// Ambil role pengguna dari data `me`
onMounted(() => {
  userStore.fetchMe();
});

// Berdasarkan role, tentukan halaman yang akan ditampilkan
const selectedComponent = computed(() => {
  // Ganti dengan logika peran pengguna yang sesuai
  if (userStore.me && userStore.hasRole(['admin', 'pemilik'])) {
    return defineAsyncComponent(() => import('@/views/dashboards/owner/OwnerDashboard.vue'));
  } else if (userStore.me && userStore.hasRole('kasir')) {
    return defineAsyncComponent(() => import('@/views/pages/cashier/CashierPage.vue'));
  } else if (userStore.me && userStore.hasRole('gudang')) {
    return defineAsyncComponent(() => import('@/views/pages/inventory/InventoryPage.vue'));
  } else if (userStore.me && userStore.hasRole('dapur')) {
    return defineAsyncComponent(() => import('@/views/pages/kitchen/KitchenPage.vue'));
  } else {
    return defineAsyncComponent(() => import('@/views/StarterPage.vue')); // Default pag)e
  }
});
</script>

<template>
  <component :is="selectedComponent" />
</template>
