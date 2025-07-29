<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay();

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

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
const { data: branches, loading: lb } = useBranchList();
const { load: loadStockRequest, summary, list: stockRequestlist, loading: lsr, update: updateRequest } = useStockRequests();
const { init: initItems, data: dataInventory, categories, loading: li, updateItem, deleteItem } = useInventoryItems();
const { init: initStockMovement, data: dataStockMovement, loading: lsm, create: createStockMovement, update: updateStockMovement } = useStockMovements();
const { load: loadFundRequest, data: fundRequestList, loading: lfr } = useFundRequests();

onMounted(() => {
  initItems();
  loadFundRequest();
  initStockMovement();
  loadStockRequest();
});

// Branch Selection
import { computed, onMounted, ref, watch } from 'vue';
import { useStockMovements } from '@/composables/useStockMovement';
import { useFundRequests } from '@/composables/useFundRequest';

const branchOptions = computed(() => branches.value);
const selectedBranch = ref<string | undefined>(undefined)
const selectedBranchObject = computed(() => {
  return branchOptions.value
  .find(branch => branch.id === selectedBranch.value
  ) || (userStore.me?.activity?.branch)
})
console.log('me', userStore.me)
// watcher perubahan selectedBranch yang memicu fetching stock request
watch(selectedBranch, () => {
  loadStockRequest({
    filter: { 'branch.id': selectedBranch.value }
  })
  console.log('selectedBranch', selectedBranch.value)
});

const pinBranch = ref(false)
</script>

<template>
    <BaseBreadcrumb
      v-if="mdAndUp && userStore.hasRole(['Admin'])"
      title="Halaman Gudang"
      :breadcrumbs="[
        { title: 'Halaman Gudang', href: '/page/inventory' }
      ]"
    >
      <template #last>
        <div style="background-color: transparent;">
          <v-select
            class="ma-0 pa-0 align-center text-subtitle-1"
            style="max-width: fit-content; min-width: 8rem;"
            variant="plain"
            v-model="selectedBranch"
            placeholder="Pilih Cabang"
            persistent-placeholder
            :items="branchOptions"
            item-title="name"
            item-value="id"
            :loading="lb"
            hide-details
            density="compact"
            clearable
          />
        </div>
      </template>
    </BaseBreadcrumb>

    <!-- sticky branch selector button -->
    <div
      v-else-if="!mdAndUp && userStore.hasRole(['Admin'])"
      class="d-flex align-center justify-end mb-4"
      :style="pinBranch ? 'position: sticky;' : ''"
      style="top: 90px; z-index: 1; background-color: transparent;"
    >
      <v-icon size="x-small" opacity="0.5" @click="pinBranch = !pinBranch" class="me-1">{{ pinBranch ? 'mdi-pin-outline' : 'mdi-pin'}}</v-icon>

      <v-select
        class="pe-2 pl-3 pb-2 rounded-pill bg-white bg-opacity-75 backdrop-blur-lg elevation-1 "
        style="max-width: fit-content; min-width: 8rem; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(1px);"
        variant="plain"
        v-model="selectedBranch"
        placeholder="Pilih Cabang"
        :items="branchOptions"
        item-title="name"
        item-value="id"
        :loading="lb"
        hide-details
        density="compact"
        clearable
      />
    </div>

  <v-row>
    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <CurrentStockRequestSummary 
            :data="summary" 
            :branch="selectedBranchObject"
            :loading="lsr" 
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12">
          <CurrentStockRequestList 
            :data="stockRequestlist.data" 
            :branch="selectedBranchObject"
            :loading="lsr" 
            class="flex-grow-1"
            :refresh="loadStockRequest"
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <InventoryItems 
            :data="dataInventory"
            :categories="categories"
            :loading="li"
            class="flex-grow-1"
            @update-item="updateItem"
            @delete-item="deleteItem"
            :refresh="initItems"
          />
        </v-col>

        <v-col cols="12">
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
        <v-col cols="12" >
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