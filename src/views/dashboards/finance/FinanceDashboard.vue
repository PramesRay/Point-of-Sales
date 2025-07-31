<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
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
import CurrentTransaction from './components/CurrentTransaction.vue';
import CurrentFundRequest from '../../pages/inventory/components/CurrentFundRequest.vue';

// Composables
import { useBranchList } from '@/composables/useBranchList';
import { useFinanceDashboard } from '@/composables/useFinanceSummary';
import { useTransactions } from '@/composables/useTransactionList';
import { useFundRequests } from '@/composables/useFundRequest';
import { useInventoryItems } from '@/composables/useInventoryItems';

// Data Loading
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { load: loadSummary, summary, loading: lf } = useFinanceDashboard();
const { load: loadTransactions, data: transactions, loading: ltx } = useTransactions();
const { load: loadFundRequest, data: fundRequestList, loading: lfr } = useFundRequests();
const { init: initItems, data: dataInventory, categories, loading: li, createItem, updateItem } = useInventoryItems();

onMounted(() => {
  loadBranch();
  loadSummary();
  initItems();
  loadFundRequest();
  loadTransactions(selectedBranch.value ?? '');
})

const branchOptions = computed(() => branches.value);
const selectedBranch = ref<string | undefined>(undefined)
const selectedBranchObject = computed(() => {
  return branchOptions.value
  .find(branch => branch.id === selectedBranch.value
  ) || undefined
})
console.log('me', userStore.me)
// watcher perubahan selectedBranch yang memicu fetching stock request
watch(selectedBranch, () => {
  loadSummary({ filter: { 'branch.id': selectedBranch.value } })
  loadFundRequest({ filter: { 'branch.id': selectedBranch.value } })
  loadTransactions(selectedBranch.value)
  console.log('selectedBranch', selectedBranch.value)
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

  <v-row v-if="lb">
    <v-col cols="12">
      <v-skeleton-loader type="card" class="mb-4" />
    </v-col>
  </v-row>

  <v-row v-else >
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12" class="d-flex">
          <TotalEarning 
          :data="summary" 
          :loading="lf" 
          class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12" class="d-flex">
          <TotalOrder 
          :data="summary" 
          :branch="selectedBranchObject"
          :loading="lf" 
          class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12" class="d-flex">
          <TotalIncome
            :data="summary"
            :loading="lf"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="8">
      <v-row>
        <v-col cols="12"class="d-flex">
          <TotalExpense
            :data="summary"
            :branch="selectedBranchObject"
            :loading="lf"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" class="d-flex">
          <CurrentTransaction
            :data="transactions"
            :branch="selectedBranchObject"
            :loading="ltx"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" class="d-flex" v-if="userStore.me">
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