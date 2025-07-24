<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

// imported components
import CurrentOrder from './components/CurrentOrder.vue';
import CurrentStockRequestList from './components/CurrentStockRequestList.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useStockRequests } from "@/composables/useStockRequest";
import { useCurrentOrders } from '@/composables/useCurrentOrder';

// Data Loading
const { data: branches, loading: lb } = useBranchList();
const { load: loadCurrentOrder, data: currentOrder, loading: lco, error, update: updateOrder } = useCurrentOrders();
const { load: loadStockRequests, summary, list: stockRequestlist, loading: lsr, create: createRequest } = useStockRequests();

onMounted(() => {
  loadCurrentOrder({
    filter: {
      status: ['Diproses', 'Pending', 'Tersaji']
    }
  })
  loadStockRequests()
})

// Branch Selection
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
    <v-col cols="12" md="6" v-if="(userStore.me?.activity?.is_active && userStore.hasRole(['Admin', 'Pemilik', 'Dapur'])) || mdAndUp">
      <v-row>
        <v-col cols="12">
          <CurrentOrder 
            :data="currentOrder.data" 
            :branch="selectedBranchObject"
            :loading="lco" 
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12">
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

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12">
          <CurrentStockRequestList 
            :data="stockRequestlist" 
            :branch="selectedBranchObject"
            :loading="lsr" 
            @create-request="createRequest"
            class="flex-grow-1" 
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>