<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import EmployeeActive from './components/EmployeeActive.vue';
import TotalOrder from '@/views/dashboards/default/components/TotalOrder.vue';
import Timesheets from './components/Timesheets.vue';
import CurrentReservation from './components/CurrentReservation.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useUser } from '@/composables/useUser';
import { useEmployeeActive } from '@/composables/useEmployeeActive';
import { useFinanceDashboard } from '@/composables/useFinanceSummary';
import { useTimesheet } from '@/composables/useTimesheet';
import { useReservation } from '@/composables/useReservation';

// Data Loading
const { data: me, loading: lu, fetchMe } = useUser();
const { branches, loading: lb } = useBranchList();
const { summary, loading: lf } = useFinanceDashboard();
const { load: loadEmployeeActive, data: employeeActiveData, loading: lea } = useEmployeeActive();
const { data: timesheetData, loading: lt, load: loadTimesheet } = useTimesheet()
const { data: reservationData, loading: lr, load: loadReservation, create: createReservation, update: updateReservation } = useReservation()

onMounted(() => {
  fetchMe();
})

const route = useRoute();
const router = useRouter();
const branchOptions = computed(() => [
  { id: 'all', name: 'Semua Cabang' },
  ...branches.value
]);
const selectedBranch = computed({
  get: () => String(route.query.branch || 'all'),
  set: val => {
    router.replace({ query: { ...route.query, branch: val } });
  }
});
const selectedBranchObject = computed(() => {
  return branchOptions.value.find(branch => branch.id === selectedBranch.value) || { id: 'all', name: 'Semua Cabang' }
})

</script>

<template>
  <BaseBreadcrumb
    title="Owner Dashboard"
    :breadcrumbs="[
      { title: 'Owner Dashboard', href: '/dashboard/owner' }
    ]"
  >
    <template #last>
      <div class="pb-3">
        <v-select
          class="ma-0 pa-0 align-center text-subtitle-1"
          variant="plain"
          v-model="selectedBranch"
          :items="branchOptions"
          item-title="name"
          item-value="id"
          :loading="lb"
          hide-details
          density="compact"
        />
      </div>
    </template>
  </BaseBreadcrumb>

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
        <v-col cols="12" v-else>
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
          <!-- -------------------------------------------------------------------- -->
          <!-- Timesheets -->
          <!-- -------------------------------------------------------------------- -->
        </v-col>
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
