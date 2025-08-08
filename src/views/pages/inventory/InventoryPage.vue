<script setup lang="ts">
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay();
import { useRoute } from 'vue-router'
const route = useRoute()

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

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
const { load: loadBranch, data: branches, loading: lb } = useBranchList();
const { load: loadStockRequest, summary, list: stockRequestlist, loading: lsr } = useStockRequests();
const { init: initItems, data: dataInventory, categories, loading: li, updateItem, deleteItem } = useInventoryItems();
const { init: initStockMovement, data: dataStockMovement, loading: lsm } = useStockMovements();
const { load: loadFundRequest, data: fundRequestList, loading: lfr } = useFundRequests();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

onMounted(() => {
  if (!userStore.me?.activity?.is_active) { 
    alertStore.showAlert('Anda belum memulai shift!', 'warning');
    return
  }

  loadBranch();

  initItems();
  loadFundRequest();
  initStockMovement();
  loadStockRequest({
    filter: { 
      'meta.created_at': new Date().toISOString().split('T')[0] 
    },
    sortBy: 'meta.created_at',
    sortDesc: true
  });
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
  ) || undefined
})

// watcher perubahan selectedBranch yang memicu fetching stock request
watch(selectedBranch, () => {
  loadStockRequest({
    filter: { 
      'branch.id': selectedBranch.value,
      'meta.created_at': new Date().toISOString().split('T')[0] 
    },
    sortBy: 'meta.created_at',
    sortDesc: true
  })
  console.log('selectedBranch', selectedBranch.value)
});

const pinBranch = ref(false)
</script>

<template>
    <BaseBreadcrumb
      v-if="mdAndUp"
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
            clear-icon="mdi-close"
          />
        </div>
      </template>
    </BaseBreadcrumb>

    <!-- sticky branch selector button -->
    <div
      v-else-if="!mdAndUp"
      class="d-flex align-center justify-end mb-4"
      :style="pinBranch ? 'position: sticky;' : ''"
      style="top: 90px; z-index: 1; background-color: transparent;"
    >
      <v-icon size="x-small" opacity="0.5" @click="pinBranch = !pinBranch" class="me-1">{{ pinBranch ? 'mdi-pin' : 'mdi-pin-outline'}}</v-icon>

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
    <!-- Text jika belum mulai shift -->
    <v-col cols="12" class="d-flex justify-center mt-2 mb-0 py-0" v-if="!userStore.me?.activity?.is_active">
      <p class="text-subtitle-1 text-disabled"> Anda belum memulai shift! </p>
    </v-col>
    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <CurrentStockRequestSummary 
            v-if="userStore.me?.activity?.is_active && (!visibleComponent || visibleComponent === 'rekapitulasi-gudang')"
            :data="summary" 
            :branch="selectedBranchObject"
            :loading="lsr" 
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12">
          <CurrentStockRequestList
            v-if="userStore.me?.activity?.is_active && (!visibleComponent || visibleComponent === 'permintaan-persediaan')"
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
            v-if="userStore.me?.activity?.is_active && (!visibleComponent || visibleComponent === 'persediaan')"
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
            v-if="userStore.me?.activity?.is_active && (!visibleComponent || visibleComponent === 'mutasi-stok')"
            :data="dataStockMovement.data"
            :branches="branches"
            :inv_item="dataInventory"
            :categories="categories"
            :loading="lsm"
            class="flex-grow-1"
            :refresh="initStockMovement"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12" >
          <CurrentFundRequest
            v-if="userStore.me?.activity?.is_active && (!visibleComponent || visibleComponent === 'permintaan-dana')"
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