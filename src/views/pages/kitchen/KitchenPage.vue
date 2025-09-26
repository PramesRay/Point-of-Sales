<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
import { useRoute } from 'vue-router'
const route = useRoute()

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

// imported components
import CurrentOrder from './components/CurrentOrder.vue';
import CurrentStockRequestList from '../inventory/components/CurrentStockRequestList.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useStockRequests } from "@/composables/useStockRequest";
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useAlertStore } from '@/stores/alert';
import MenuQuantityManagement from './components/MenuQuantityManagement.vue';
import type { ShiftKitchen } from '@/types/shift';
import { useShift } from '@/composables/useShift';
import { useBranchList } from '@/composables/useBranchList';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useMenu } from '@/composables/useMenuItems';

// Data Loading
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { load: loadCurrentOrder, data: currentOrder, loading: lco, } = useCurrentOrders();
const { load: loadStockRequests, list: stockRequestlist, loading: lsr } = useStockRequests();
const { loadMenuSales, dataItemSales: menuSales, categories, loading: lm } = useMenu()
const { loadShiftbyRole, loadCurrentShiftWarehouse, shiftCurrentKitchen, shiftCurrentWarehouse } = useShift()
const alertStore = useAlertStore();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

onMounted(async () => {
  if (!userStore.me?.activity?.is_active) { 
    alertStore.showAlert('Anda belum memulai shift!', 'warning');
    return
  }

  await loadBranch()
  
  selectedBranch.value ? loadMenuSales(selectedBranch.value ?? branchOptions.value[0]?.id) : null
  loadCurrentOrder({ filter: { branch_id: selectedBranch.value ?? branchOptions.value[0]?.id } })
  loadStockRequests()
  loadShiftbyRole({ filter: { branch_id: selectedBranch.value ?? branchOptions.value[0]?.id } })
  loadCurrentShiftWarehouse()
})
const branchOptions = computed(() => branches.value);
const selectedBranch = ref<string | undefined>( 
  userStore.hasRole(['admin', 'pemilik']) 
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

const currentKitchenShift = computed(() => {
  if (!userStore.hasRole(['admin', 'pemilik'])) return userStore.me?.activity?.shift_op as ShiftKitchen

  if (!selectedBranch.value || shiftCurrentKitchen.value?.branch?.id === selectedBranch.value) {
    return shiftCurrentKitchen.value as ShiftKitchen
  }
  
  return null
})

const currentWarehouseShift = computed(() => {
  return shiftCurrentWarehouse?.value
})

watch(
  () => selectedBranch.value,
  () => {
    selectedBranch.value ? loadMenuSales(selectedBranch.value ?? branchOptions.value[0]?.id) : null
    loadCurrentOrder({ filter: { branch_id: selectedBranch.value ?? branchOptions.value[0]?.id } })
    loadStockRequests()
    loadShiftbyRole({ filter: { branch_id: selectedBranch.value ?? branchOptions.value[0]?.id } })
    loadCurrentShiftWarehouse()
  }
)
const pinBranch = ref(true)
</script>

<template>
  <BaseBreadcrumb
    title="Halaman Dapur"
    v-if="mdAndUp && userStore.hasRole(['admin', 'pemilik'])"
    :breadcrumbs="[
      { title: 'Dapur', href: '/halaman/dapur' }
    ]"
  >
    <template #last>
      <div >
        <v-select
          class="ma-0 pa-0 align-center text-subtitle-1"
          style="max-width: max-content; min-width: 8rem;"
          variant="plain"
          v-model="selectedBranch"
          :items="branchOptions"
          placeholder="Pilih Cabang"
          item-title="name"
          item-value="id"
          :loading="lb"
          hide-details
          density="compact"
          clearable
          clear-icon="mdi-close"
        />
      </div>
    </template>
  </BaseBreadcrumb>

  <!-- sticky branch selector button -->
  <div
    v-else-if="userStore.hasRole(['admin', 'pemilik'])"
    class="d-flex align-center justify-end mb-4"
    :style="pinBranch ? 'position: sticky;' : ''"
    style="top: 90px; z-index: 1; background: transparent;"
  >
    <v-icon size="x-small" opacity="0.5" @click="pinBranch = !pinBranch" class="me-1">{{ pinBranch ? 'mdi-pin' : 'mdi-pin-outline'}}</v-icon>

    <v-select
      class="pe-2 pl-3 pb-2 rounded-pill bg-white bg-opacity-75 backdrop-blur-lg elevation-1 "
      style="max-width: fit-content; min-width: 8rem; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(1px);"
      variant="plain"
      v-model="selectedBranch"
      :items="branchOptions"
      placeholder="Pilih Cabang"
      item-title="name"
      item-value="id"
      :loading="lb"
      hide-details
      density="compact"
      clearable
    />
  </div>

  <v-row>
    <!-- Text jika belum mulai shift -->
    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-if="!userStore.me?.activity?.is_active">
      <p class="text-subtitle-1 text-disabled"> Anda belum memulai sif! </p>
    </v-col>
    
    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-else-if="currentKitchenShift?.end || currentWarehouseShift?.end">
      <p class="text-subtitle-1 text-disabled"> Sif dapur atau sif gudang belum dimulai! </p>
    </v-col>

    <!-- Kolom Kiri: Current Order + Current Transaction -->
     <template v-else-if="userStore.hasRole(['admin', 'pemilik']) || userStore.me?.activity?.shift_op?.start">
      <!-- Kolom Kiri: Current Order + Current Transaction -->
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <CurrentOrder 
              v-if="(!visibleComponent || visibleComponent === 'pesanan')"
              :data="currentOrder.data" 
              :branch="selectedBranchObject"
              :loading="lco" 
              class="flex-grow-1" 
            />
          </v-col>
          <v-col cols="12">
            <CurrentOrderQue
              v-if="(!visibleComponent || visibleComponent === 'pesanan')"
              :data="currentOrder.data"
              :data_menu="menuSales"
              :branch="selectedBranchObject"
              :loading="lco"
  
              :refresh="() => loadCurrentOrder({ filter: { branch_id: selectedBranch ?? branchOptions[0]?.id } })"
              class="flex-grow-1" 
            />
          </v-col>
        </v-row>
      </v-col>
  
      <!-- Kolom Kanan: Create Order + Current Order Que -->
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <CurrentStockRequestList 
              v-if="(!visibleComponent || visibleComponent === 'permintaan-persediaan')"
              :data="stockRequestlist.data" 
              :branch="selectedBranchObject"
              :loading="lsr" 
              class="flex-grow-1" 
              :refresh="loadStockRequests"
            />
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12">
            <MenuQuantityManagement 
              v-if="(!visibleComponent || visibleComponent === 'permintaan-persediaan')"
              :data="currentKitchenShift!" 
              :branch="selectedBranchObject"
              :loading="lsr" 
              class="flex-grow-1" 
              :refresh="() => userStore.hasRole(['admin', 'pemilik']) 
              ? loadShiftbyRole({
                  sortBy: 'meta.created_at',
                  sortDesc: true
                }) 
              : userStore.fetchShift()"
            />
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>