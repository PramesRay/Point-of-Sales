<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
import { useRoute } from 'vue-router'
const route = useRoute()

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import EmployeeActive from './components/EmployeeActive.vue';
import TotalOrder from '@/views/dashboards/finance/components/TotalOrder.vue';
import Timesheets from './components/Timesheets.vue';
import CurrentReservation from './components/CurrentReservation.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useUser } from '@/composables/useUser';
import { useEmployeeActive } from '@/composables/useEmployeeActive';
import { useReservation } from '@/composables/useReservation';
import { useUserStore } from '@/stores/authUser';
import { useMenu } from '@/composables/useMenuItems';
import Management from './components/Management.vue';
import ShiftList from './components/ShiftList.vue';
import { useShift } from '@/composables/useShift';
import { useTotalOrder } from '@/composables/useTotalOrder';

// Data Loading
const userStore = useUserStore();
const { load: loadTotalOrder, data: totalOrderData, loading: lo } = useTotalOrder();
const { load: loadEmployeeActive, data: employeeActiveData, loading: lea } = useEmployeeActive();
const { data: reservationData, loading: lr, load: loadReservation } = useReservation()
const { load: loadUser, data: userData, loading: lu } = useUser()
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { load: loadMenu, loadCategory, data: menuData, categories: menuCategories, loading: lm } = useMenu();
const { loadShiftbyRole, loadCashier, loadEmployee, loadKitchen, loadWarehouse, shiftCashier, shiftEmployee, shiftKitchen, shiftWarehouse, loading: ls } = useShift()

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})


const branchOptions = computed(() => branches.value);
const selectedBranch = ref<string | undefined>(undefined)
const selectedBranchObject = computed(() => {
  return branchOptions.value.find(branch => branch.id === selectedBranch.value) || undefined
})

onMounted(async () => {
  await loadBranch()

  loadMenu(selectedBranch.value ?? branchOptions.value[0]?.id)
  loadUser()
  loadTotalOrder()
  loadReservation()
  loadEmployeeActive({ filter: { 'branch_id': selectedBranch.value ?? branchOptions.value[0]?.id } })
  // loadShiftbyRole()
  loadEmployee()
  loadCashier()
  loadKitchen()
  loadWarehouse()
})

// watcher perubahan selectedBranch yang memicu fetching stock request
watch(selectedBranch, () => {
  loadUser()
  loadMenu(selectedBranch.value ?? branchOptions?.value[0].id)
  loadTotalOrder(selectedBranch.value)
  loadEmployeeActive({ filter: { 'branch_id': selectedBranch.value ?? branchOptions.value[0]?.id } })
  loadReservation()
  // loadShiftbyRole()
  loadEmployee()
  loadCashier()
  loadKitchen()
  loadWarehouse()
});

const pinBranch = ref(true)
</script>

<template>
  <BaseBreadcrumb
    title="Dashboard Pemilik"
    v-if="mdAndUp"
    :breadcrumbs="[
      { title: 'Pemilik', href: '/dashboard/owner' }
    ]"
  >
    <template #last>
      <div >
        <v-select
          class="ma-0 pa-0 align-center text-subtitle-1"
          style="max-width: fit-content; min-width: 8rem;"
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

  <v-row>
    <v-col cols="12" md="8">
      <v-row>
        <!-- -------------------------------------------------------------------- -->
        <!-- Employee Active -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="6" v-if="!visibleComponent || visibleComponent === 'aktifitas-karyawan'">
          <EmployeeActive
          :data="employeeActiveData!" 
          :branch="selectedBranchObject"
          :loading="lea"
          class="flex-grow-1" 
          />
        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Total Order -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="6" v-if="!visibleComponent || visibleComponent === 'aktifitas-karyawan'">
          <TotalOrder 
            :data="totalOrderData!" 
            :branch="selectedBranchObject"
            :loading="lo" 
            :refresh="() => loadTotalOrder(selectedBranch)"
            class="flex-grow-1" 
          />
        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Timesheets -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" v-if="!mdAndUp && (!visibleComponent || visibleComponent === 'shift')">
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
        <v-col cols="6" v-if="mdAndUp && (!visibleComponent || visibleComponent === 'reservasi')">
          <CurrentReservation
            :data="reservationData" 
            :branch="selectedBranchObject"
            :branch_option="branchOptions"
            :loading="lr"
            :refresh="loadReservation"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="6" v-if="mdAndUp && (!visibleComponent || visibleComponent === 'manajemen')">
          <Management 
            :branch="selectedBranchObject"
            :data_user="userData"
            :data_branch="branches"
            :data_menu="menuData"
            :menu_categories="menuCategories"
            :loading_user="lu"
            :loading_branch="lb"
            :loading_menu="lm"
            :refresh_menu="() => loadMenu(selectedBranch ?? branchOptions[0].id)"
            :refresh_branch="loadBranch"
            :refresh_user="loadUser"
            :refresh_category="loadCategory"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4">
      <v-row>
        <!-- -------------------------------------------------------------------- -->
        <!-- Current Reservation -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" v-if="!mdAndUp && (!visibleComponent || visibleComponent === 'reservasi')">
          <CurrentReservation
            :data="reservationData" 
            :branch="selectedBranchObject"
            :branch_option="branchOptions"
            :loading="lr"
            :refresh="loadReservation"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="12" v-if="!mdAndUp && (!visibleComponent || visibleComponent === 'manajemen')">
          <Management 
            :branch="selectedBranchObject ?? branchOptions[0]"
            :data_user="userData"
            :data_branch="branches"
            :data_menu="menuData"
            :menu_categories="menuCategories"
            :loading_user="lu"
            :loading_branch="lb"
            :loading_menu="lm"
            :refresh_menu="() => loadMenu(selectedBranch ?? branchOptions[0].id)"
            :refresh_branch="loadBranch"
            :refresh_user="loadUser"
            :refresh_category="() => loadCategory(selectedBranch ?? branchOptions[0].id)"
            class="flex-grow-1"
          />
        </v-col>
          <!-- -------------------------------------------------------------------- -->
          <!-- Timesheets -->
          <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" v-if="mdAndUp && (!visibleComponent || visibleComponent === 'shift')">
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
      </v-row>
    </v-col>
  </v-row>
</template>