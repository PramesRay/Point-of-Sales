<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import GlobalTable from '@/components/shared/GlobalTable.vue'
import DetailTransaction from './DetailTransaction.vue'

import { useOverlayManager } from '@/composables/non-services/useOverlayManager'
import { useTransactions } from '@/composables/useTransactionList'

import type { Transaction } from '@/types/finance'

import { formatDate } from '@/utils/helpers/format-date'

import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

// Composables
const { openOverlay } = useOverlayManager()
const { loadTableData } = useTransactions();

const branchOptions = computed(() => [
  { id: '', name: 'Semua Cabang' },
  ...(userStore.me?.assigned_branch || [])
]);
const selectedBranch = ref<string | undefined>(
  userStore.hasRole(['Admin', 'Pemilik', 'Bendahara']) 
  ? undefined
  : userStore.me?.activity.branch?.id 
    ? userStore.me.activity.branch.id 
    : undefined
);
const selectedBranchObject = computed(() => {
  return branchOptions.value
  .find(branch => branch.id === selectedBranch.value
  ) || undefined
})

// Dummy headers (ubah sesuai kebutuhanmu)
const headers: DataTableHeader[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tanggal', key: 'date' },
  { title: 'Subjek', key: 'subject' },
  { title: 'Catatan', key: 'notes' },
  { title: 'Jumlah', key: 'amount' },
  { title: 'Cabang', key: 'branch.name' }
]

function handleRowClick(row: Transaction) {
  openOverlay({
    component: DetailTransaction,
    props: {
      data: row,
      is_create: false,
      confirmBeforeClose: true,
      isChanged: false // akan di-bind dari dalam
    }
  })
}

</script>

<template>
    <v-row>
      <v-col cols="12">
        <GlobalTable
          :headers="headers"
          :fetch-data="loadTableData"
          searchable
          pagination
          show-all-toggle
          @row-click="handleRowClick">
          
          <template #append>
            <v-btn
              v-if="userStore.hasRole(['Admin', 'Pemilik', 'Bendahara'])"
              class="rounded-sm"
              color="primary"
              text="Tambah Transaksi"
              @click="openOverlay({
                component: DetailTransaction,
                props: {
                  is_create: true,
                  confirmBeforeClose: true,
                  isChanged: false
                }
              })"
            >
            </v-btn>
          </template>
          
          <template #filters="{ filters, update }">
            <div>
              <v-select
                class="pe-2 pl-3 pb-2 rounded-pill bg-white bg-opacity-75 backdrop-blur-lg elevation-0 "
                style="min-width: 12rem; max-width: max-content; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(1px);"
                variant="plain"
                v-model="selectedBranch"
                :items="branchOptions"
                item-title="name"
                item-value="id"
                :placeholder="selectedBranchObject?.name || 'Semua Cabang'"
                prepend-icon="mdi-home"
                clearable
                hide-details
                density="compact"
                @update:model-value="update({ ...filters, 'branch.id': selectedBranch }), console.log('filters', filters)"
              />
            </div>
          </template>

          <template #id="{ item }">
            <i class="text-disabled"> {{ item.id }} </i>
          </template>
          
          <template #date="{ item }">
            {{ formatDate(item.date).replace(' pukul', ':') }}
          </template>
          
          <template #amount="{ item }">
            <span :class="item.is_income ? 'text-success' : 'text-error'">Rp {{ item.amount.toLocaleString() }}</span>
          </template>

        </GlobalTable>
      </v-col>
    </v-row>
</template>