<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
const userStore = useUserStore();
const alertStore = useAlertStore();

// imported components
import CurrentOrder from '../kitchen/components/CurrentOrder.vue';
import CreateOrder from './components/CreateOrder.vue';
import CurrentOrderQue from '../kitchen/components/CurrentOrderQue.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useMenuItems } from '@/composables/useMenuItems';

// Data Loading
const { data: branches, loading: lb } = useBranchList();
const { load: loadCurrentOrder, data: currentOrder, loading: lco, update: updateOrder, create: createOrder } = useCurrentOrders();
const { loadItemSales, dataItemSales: menuSales, categories, loading: lm } = useMenuItems();

onMounted(() => {
  if (!userStore.me?.activity?.is_active) { 
    alertStore.showAlert('Anda belum memulai shift!', 'warning');
    return
  }

  if (userStore.hasRole(['Admin', 'Pemilik'])) {
    loadCurrentOrder({
      filter: {
        'meta.created_at': new Date().toISOString().split('T')[0]
      },
      sortBy: 'meta.updated_at',
      sortDesc: true
    })
  } else {
    loadCurrentOrder({
      filter: {
        'shift_cashier_id': userStore.me?.activity?.shift_op_id
      },
      sortBy: 'meta.updated_at',
      sortDesc: true
    })
  }
  loadItemSales(userStore.me?.activity?.branch?.id);
})

const branchOptions = computed(() => [
  { id: 'all', name: 'Semua Cabang' },
  ...branches.value
]);
const selectedBranch = ref<string | undefined>(
  userStore.hasRole(['Admin', 'Pemilik', 'Kasir']) 
  ? undefined
  : userStore.me?.activity?.branch?.id 
    ? userStore.me.activity.branch.id 
    : undefined
);
const selectedBranchObject = computed(() => {
  return branchOptions.value
  .find(branch => branch.id === selectedBranch.value
  ) || undefined
})
</script>

<template>
  <v-row>
    <!-- Text jika belum mulai shift -->
    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-if="!userStore.me?.activity?.is_active">
      <p class="text-subtitle-1 text-disabled"> Anda belum memulai shift! </p>
    </v-col>

    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="6" v-if="(userStore.me?.activity?.is_active && userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])) || mdAndUp">
      <v-row>
        <v-col cols="12" v-if="userStore.me?.activity?.is_active && userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])">
          <CurrentOrder 
            :data="currentOrder.data" 
            :branch="selectedBranchObject"
            :loading="lco" 
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12" v-if="userStore.me?.activity?.is_active && userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])">
          <CreateOrder 
            :data_menu="menuSales"
            :categories="categories"
            :refresh="loadCurrentOrder"
            class="flex-grow-1" 
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="6">
      <v-row>

        <v-col cols="12" v-if="userStore.me?.activity?.is_active && userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])">
          <CurrentOrderQue
            :data="currentOrder.data"
            :branch="selectedBranchObject"
            :loading="lco"

            :load="loadCurrentOrder"
            :refresh="loadCurrentOrder"
            class="flex-grow-1" 
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
