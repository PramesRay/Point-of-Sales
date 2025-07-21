<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

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
  loadCurrentOrder()
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
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Order Card -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentOrder 
        :data="currentOrder" 
        :branch="selectedBranchObject"
        :loading="lco" 
        class="flex-grow-1" 
      />
    </v-col>
    
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Order Que -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4" v-if="userStore.hasRole(['Admin', 'Dapur', 'Kasir'])">
      <CurrentOrderQue
        :data="currentOrder" 
        :branch="selectedBranchObject"
        :loading="lco"
        class="flex-grow-1" 
      />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Stock Request List -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentStockRequestList 
        :data="stockRequestlist" 
        :branch="selectedBranchObject"
        :loading="lsr" 
        @create-request="createRequest"
        class="flex-grow-1" 
      />
    </v-col>
  </v-row>
</template>