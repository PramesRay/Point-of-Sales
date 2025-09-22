<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute()
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

// Imported Components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TotalEarning from './components/TotalEarning.vue';
import TotalOrder from './components/TotalOrder.vue';
import TotalIncome from './components/TotalIncome.vue';
import TotalExpense from './components/TotalExpense.vue';
import CurrentFundRequest from '../../pages/inventory/components/CurrentFundRequest.vue';

// Composables
import { useBranchList } from '@/composables/useBranchList';
import { useFinanceDashboard } from '@/composables/useFinanceSummary';
import { useFundRequests } from '@/composables/useFundRequest';
import { useShift } from '@/composables/useShift';
import { useUser } from '@/composables/useUser';
import ShiftList from '../owner/components/ShiftList.vue';
import { useTotalOrder } from '@/composables/useTotalOrder';

// Data Loading
const { load: loadUser, data: userData, loading: lu } = useUser()
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { loadCashier, loadEmployee, loadKitchen, loadWarehouse, loadShiftbyRole, shiftCashier, shiftEmployee, shiftKitchen, shiftWarehouse, loading: ls } = useShift()
const { load: loadSummary, summary, loading: lf } = useFinanceDashboard();
const { load: loadTotalOrder, data: totalOrderData, loading: lo } = useTotalOrder();
const { load: loadFundRequest, data: fundRequestList, loading: lfr } = useFundRequests();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})


onMounted(async () => {
  await loadBranch();
  loadUser()
  loadShiftbyRole()
  loadSummary();
  loadTotalOrder();
  loadFundRequest();
})

const branchOptions = computed(() => branches.value);
const selectedBranch = ref<string | undefined>(undefined)
const selectedBranchObject = computed(() => {
  return branchOptions.value
  .find(branch => branch.id === selectedBranch.value
  ) || undefined
})
// watcher perubahan selectedBranch yang memicu fetching stock request
watch(selectedBranch, () => {
  loadSummary({ filter: { 'branch_id': selectedBranch.value } })
  loadTotalOrder(selectedBranch.value)
  loadFundRequest({ filter: { 'branch_id': selectedBranch.value } })
});

const pinBranch = ref(false)
</script>

<template>
  <BaseBreadcrumb
    v-if="mdAndUp"
    title="Dashboard Bendahara"
    :breadcrumbs="[
      { title: 'Bendahara', href: '/dashboard/finance' }
    ]"
  >
    <template #last>
      <div style="background-color: transparent;">
        <v-select
          class="ma-0 pa-0 align-center text-subtitle-1"
          style="max-width: fit-content; min-width: 8rem;"
          variant="plain"
          v-model="selectedBranch"
          :items="branchOptions"
          placeholder="Pilih Cabang"
          persistent-placeholder
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
    v-else
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

  <v-row v-if="lb" justify="center" align="center">
    <v-col cols="12">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
  </v-row>

  <v-row v-else >
    <v-col cols="12" md="4">
      <v-row v-if="!visibleComponent || visibleComponent === 'rekapitulasi-keuangan'">
        <v-col cols="12">
          <TotalEarning 
            :data="summary!"
            :loading="lf" 
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12">
          <TotalOrder 
            :data="totalOrderData!" 
            :branch="selectedBranchObject"
            :loading="lf" 
            :refresh="() => loadTotalOrder(selectedBranch)"
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12">
          <TotalIncome
            :data="summary!"
            :data_branch="branchOptions"
            :loading="lf"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="8">
      <v-row>
        <v-col cols="12" v-if="!visibleComponent || visibleComponent === 'rekapitulasi-keuangan'">
          <TotalExpense
            :data="summary!"
            :branch="selectedBranchObject"
            :loading="lf"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" v-if="!visibleComponent || visibleComponent === 'shift'">
          <ShiftList
            :branch="selectedBranchObject"
            :loading="ls"

            :shift_employee="shiftEmployee.data"
            :shift_cashier="shiftCashier.data"
            :shift_kitchen="shiftKitchen.data"
            :shift_warehouse="shiftWarehouse.data"

            :data_employee="userData"
            :data_branch="branches"

            :refresh_employee="loadEmployee"
            :refresh_cashier="loadCashier"
            :refresh_kitchen="loadKitchen"
            :refresh_warehouse="loadWarehouse"
            :refresh_employees="loadUser"
            :refresh_branches="loadBranch"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" v-if="!visibleComponent || visibleComponent === 'permintaan-dana'">
          <CurrentFundRequest
            :data="fundRequestList.data"
            :branch="selectedBranchObject"
            :loading="lfr"
            class="flex-grow-1"
            :refresh="loadFundRequest"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>