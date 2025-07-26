<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

// imported components
import CurrentOrder from './components/CurrentOrder.vue';
import CurrentStockRequestList from '../inventory/components/CurrentStockRequestList.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useStockRequests } from "@/composables/useStockRequest";
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useAlertStore } from '@/stores/alert';

// Data Loading
const { load: loadCurrentOrder, data: currentOrder, loading: lco, error, update: updateOrder } = useCurrentOrders();
const { load: loadStockRequests, list: stockRequestlist, loading: lsr, create: createRequest } = useStockRequests();
const alertStore = useAlertStore();

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
        'shift_kitchen_id': userStore.me?.activity?.shift_op_id
      },
      sortBy: 'meta.updated_at',
      sortDesc: true
    })
  }
  loadStockRequests()
})

</script>

<template>
  <v-row>
    <!-- Text jika belum mulai shift -->
    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-if="!userStore.me?.activity?.is_active">
      <p class="text-subtitle-1 text-disabled"> Anda belum memulai shift! </p>
    </v-col>

    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12">
          <CurrentOrder 
            :data="currentOrder.data" 
            :branch="userStore.me?.activity?.branch"
            :loading="lco" 
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12">
          <CurrentOrderQue
            :data="currentOrder.data"
            :branch="userStore.me?.activity?.branch"
            :loading="lco"

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
            :branch="userStore.me?.activity?.branch"
            :loading="lsr" 
            @create-request="createRequest"
            class="flex-grow-1" 
            :refresh="loadStockRequests"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>