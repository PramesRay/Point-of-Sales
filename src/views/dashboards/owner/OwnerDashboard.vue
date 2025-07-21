<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

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
import { useFinanceDashboard } from '@/composables/useFinanceSummary';
import { useTimesheet } from '@/composables/useTimesheet';
import { useReservation } from '@/composables/useReservation';
import { useUserStore } from '@/stores/authUser';
import { useMenuItems } from '@/composables/useMenuItems';
import Management from './components/Management.vue';

// Data Loading
const userStore = useUserStore();
const { summary, loading: lf } = useFinanceDashboard();
const { load: loadEmployeeActive, data: employeeActiveData, loading: lea } = useEmployeeActive();
const { data: timesheetData, loading: lt, load: loadTimesheet } = useTimesheet()
const { data: reservationData, loading: lr, load: loadReservation, create: createReservation, update: updateReservation } = useReservation()
const { load: loadUser, data: userData, loading: lu } = useUser()
const { load: loadBranch, data: branchData, loading: lb } = useBranchList();
const { init: loadMenu, loadCategory, data: menuData, categories: menuCategories, loading: lm } = useMenuItems();

onMounted(() => {
  if(!userStore.me) userStore.fetchMe()

  loadMenu()
  loadBranch()
  loadUser()
  // loadTimesheet(selectedBranch.value)
  // loadReservation(selectedBranch.value)
  loadEmployeeActive(selectedBranch.value)
})

const branchOptions = computed(() => [
  { id: '', name: 'Semua Cabang' },
  ...(userStore.me?.assigned_branch || [])
]);
const selectedBranch = ref<string | undefined>(
  userStore.hasRole(['Admin', 'Pemilik']) 
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

const pinBranch = ref(false)
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
    />
  </div>

  <v-row>
    <v-col cols="12" md="8">
      <v-row>
        <!-- -------------------------------------------------------------------- -->
        <!-- Employee Active -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="6">
          <EmployeeActive
          :data="employeeActiveData" 
          :branch="selectedBranchObject"
          :loading="lea"
          class="flex-grow-1" 
          />
        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Total Order -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" md="6">
          <TotalOrder 
          :data="summary" 
          :branch="selectedBranchObject"
          :loading="lf" 
          class="flex-grow-1" 
          />
        </v-col>
        <!-- -------------------------------------------------------------------- -->
        <!-- Timesheets -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" v-if="!mdAndUp">
          <Timesheets 
            :data="timesheetData" 
            :branch="selectedBranchObject"
            :loading="lt"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="6" v-else>
          <CurrentReservation
            :data="reservationData" 
            :branch="selectedBranchObject"
            :branch_option="branchOptions"
            :loading="lr"
            @create-reservation="createReservation"
            @update-reservation="updateReservation"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="6" v-if="mdAndUp">
          <Management 
            :branch="selectedBranchObject!"
            :data_user="userData"
            :data_branch="branchData"
            :data_menu="menuData"
            :menu_categories="menuCategories"
            :loading_user="lu"
            :loading_branch="lb"
            :loading_menu="lm"
            :refresh_menu="loadMenu"
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
        <v-col cols="12" v-if="!mdAndUp">
          <CurrentReservation
            :data="reservationData" 
            :branch="selectedBranchObject"
            :branch_option="branchOptions"
            :loading="lr"
            @create-reservation="createReservation"
            @update-reservation="updateReservation"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="12" v-if="!mdAndUp">
          <Management 
            :branch="selectedBranchObject!"
            :data_user="userData"
            :data_branch="branchData"
            :data_menu="menuData"
            :menu_categories="menuCategories"
            :loading_user="lu"
            :loading_branch="lb"
            :loading_menu="lm"
            :refresh_menu="loadMenu"
            :refresh_branch="loadBranch"
            :refresh_user="loadUser"
            class="flex-grow-1"
          />
        </v-col>
          <!-- -------------------------------------------------------------------- -->
          <!-- Timesheets -->
          <!-- -------------------------------------------------------------------- -->
        <v-col cols="12" v-else>
          <Timesheets 
            :data="timesheetData" 
            :branch="selectedBranchObject"
            :loading="lt"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
