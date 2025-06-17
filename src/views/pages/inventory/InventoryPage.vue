<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { hasRole } from '@/utils/helpers/user';

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CurrentFundRequest from './components/CurrentFundRequest.vue';
import CurrentStockRequestSummary from './components/CurrentStockRequestSummary.vue';
import CurrentStockRequestList from './components/CurrentStockRequestList.vue';
import InventoryItems from './components/InventoryItems.vue'
import StockMovement from './components/StockMovement.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useStockRequests } from "@/composables/useStockRequest";
import { useInventoryItems } from "@/composables/useInventoryItems";

// Data Loading
const { data: me, loading: lu, fetchMe } = useUser();
const { branches, loading: lb } = useBranchList();
const { summary, list: stockRequestlist, loading: lsr, updateRequest } = useStockRequests();
const { init: initItems, data: dataInventory, categories, loading: li, updateItem, deleteItem } = useInventoryItems();
const { init: initStockMovement, data: dataStockMovement, loading: lsm, create: createStockMovement, update: updateStockMovement } = useStockMovements();
const { requests, loading: lfr, create: createFundRequest, update: updateFundRequest } = useFundRequests();

onMounted(() => {
  fetchMe();
  initItems();
  initStockMovement();
});

// Branch Selection
import { computed, onMounted } from 'vue';
import { useStockMovements } from '@/composables/useStockMovement';
import { useFundRequests } from '@/composables/useFundRequest';
import { useUser } from '@/composables/useUser';

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
    title="Inventory"
    :breadcrumbs="[
      { title: 'Inventory', href: '/page/inventory' }
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
    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <CurrentStockRequestSummary 
            :data="summary" 
            :branch="selectedBranch"
            :loading="lsr" 
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12">
          <CurrentStockRequestList 
            :data="stockRequestlist" 
            :branch="selectedBranch"
            :loading="lsr" 
            class="flex-grow-1"
            @approve-request="updateRequest"
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <InventoryItems 
            :data="dataInventory"
            :categories="categories"
            :loading="li"
            class="flex-grow-1"
            @update-item="updateItem"
            @delete-item="deleteItem"
          />
        </v-col>

        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <StockMovement
            :data="dataStockMovement"
            :categories="categories"
            :branches="branches"
            :loading="lsm"
            class="flex-grow-1"
            @create-sm="createStockMovement"
            @update-sm="updateStockMovement"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
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