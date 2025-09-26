<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
import { useRoute } from 'vue-router'
const route = useRoute()

import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
const userStore = useUserStore();
const alertStore = useAlertStore();

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CurrentOrder from '../kitchen/components/CurrentOrder.vue';
import CreateOrder from './components/CreateOrder.vue';
import CurrentOrderQue from '../kitchen/components/CurrentOrderQue.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useMenu } from '@/composables/useMenuItems';
import type { ShiftKitchen } from '@/types/shift';
import { useShift } from '@/composables/useShift';

// Data Loading
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { load: loadCurrentOrder, data: currentOrder, loading: lco } = useCurrentOrders();
const { loadMenuSales: loadMenuSales, dataItemSales: menuSales, categories, loading: lm } = useMenu();
const { loadShiftbyRole, shiftCurrentKitchen } = useShift()


const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

onMounted(async () => {
  if (!userStore.me?.activity?.is_active) { 
    alertStore.showAlert('Anda belum memulai shift!', 'warning');
    return
  }

  await loadBranch()

  loadCurrentOrder()
  loadMenuSales(selectedBranch.value ?? branchOptions.value[0]?.id)
  loadShiftbyRole()
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

watch(
  () => selectedBranch.value,
  () => {
    loadMenuSales(selectedBranch.value ?? branchOptions.value[0]?.id)
    loadCurrentOrder()
    loadShiftbyRole()
  }
)

const pinBranch = ref(true)
</script>

<template>
  <BaseBreadcrumb
    title="Halaman Kasir"
    v-if="mdAndUp && userStore.hasRole(['admin', 'pemilik'])"
    :breadcrumbs="[
      { title: 'Kasir', href: '/halaman/kasir' }
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
      <p class="text-subtitle-1 text-disabled"> Anda belum memulai shift! </p>
    </v-col>

    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-else-if="!userStore.me?.activity?.shift_op?.start && !userStore.hasRole(['admin', 'pemilik'])">
      <p class="text-subtitle-1 text-disabled"> Belum ada shift kasir yang dimulai! </p>
    </v-col>

    <!-- Kolom Kiri: Current Order + Current Transaction -->
     <template v-else-if="userStore.hasRole(['admin', 'pemilik']) || userStore.me?.activity?.shift_op?.start">
       <v-col cols="12" md="6" v-if="!visibleComponent || visibleComponent === 'rekapitulasi-pesanan'">
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
           <v-col cols="12" v-if="(!visibleComponent || visibleComponent === 'pesanan')">
             <CurrentOrderQue
               :data="currentOrder.data"
               :data_menu="menuSales"
               :branch="selectedBranchObject"
               :loading="lco"
   
               :refresh="loadCurrentOrder"
               class="flex-grow-1" 
             />
           </v-col>
         </v-row>
       </v-col>
     </template>
  </v-row>
</template>
