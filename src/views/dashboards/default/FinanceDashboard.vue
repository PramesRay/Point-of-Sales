<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
import { useUser } from '@/composables/useUser';
import { useInventoryItems } from '@/composables/useInventoryItems';

// Data Loading
const { data: me, loading: lu, fetchMe } = useUser();
const { branches, loading: lb } = useBranchList();
const { summary, loading: lf } = useFinanceDashboard();
const { transactions, loading: ltx } = useTransactions();
const { requests, loading: lfr, create: createFundRequest, update: updateFundRequest } = useFundRequests();
const { init: initItems, data: dataInventory, categories, loading: li, createItem, updateItem } = useInventoryItems();

onMounted(() => {
  fetchMe();
  initItems();
})

// Branch Selection
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
    title="Finance Dashboard"
    :breadcrumbs="[
      { title: 'Dashboard', href: '/' },
      { title: 'Finance', href: '/dashboard/default' }
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
            :branch="selectedBranch"
            :loading="lf"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" class="d-flex">
          <CurrentTransaction
            :data="transactions"
            :branch="selectedBranch"
            :loading="ltx"
            class="flex-grow-1"
          />
        </v-col>
        
        <v-col cols="12" md="6" class="d-flex" v-if="me">
          <CurrentFundRequest
            :user="me"
            :data="requests"
            :inv_items="dataInventory"
            :branch="selectedBranchObject"
            :loading="lfr"
            class="flex-grow-1"
            @create-fr="createFundRequest"
            @update-fr="updateFundRequest"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>