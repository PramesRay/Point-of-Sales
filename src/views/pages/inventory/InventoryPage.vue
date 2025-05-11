<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
// import CurrentFundRequest from '@/views/dashboards/default/components/CurrentFundRequest.vue';
import CurrentStockRequestSummary from './components/CurrentStockRequestSummary.vue';
import CurrentStockRequestList from './components/CurrentStockRequestList.vue';
import InventoryItems from './components/InventoryItems.vue'

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useStockRequests } from "@/composables/useStockRequest";
import { useInventoryItems } from "@/composables/useInventoryItems";

// Data Loading
const { branches, loading: lb } = useBranchList();
const { summary, list: stockRequestlist, loading: lsr } = useStockRequests();
const { init, data: dataInventory, categories, loading: li } = useInventoryItems();

onMounted(init)

// Branch Selection
import { computed, onMounted } from 'vue';
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
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Restock Card -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentStockRequestSummary 
        :data="summary" 
        :branch="selectedBranch"
        :loading="lsr" 
        class="flex-grow-1" 
      />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Stock Request List -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentStockRequestList 
        :data="stockRequestlist" 
        :branch="selectedBranch"
        :loading="lsr" 
        class="flex-grow-1" 
      />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Inventory Stock -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <InventoryItems 
        :data="dataInventory"
        :categories="categories"
        :loading="li"
      />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Stock Movement -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <StockMovement />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Fund Request -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <CurrentFundRequest />
    </v-col>
  </v-row>
</template>

function useInventoryItems() {
  throw new Error('Function not implemented.');
}
