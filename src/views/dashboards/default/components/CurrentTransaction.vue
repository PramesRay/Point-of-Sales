<script setup lang="ts">
import { formatRupiah } from '@/utils/helpers/currency'
import { ref, computed } from 'vue'
import type { Transaction } from '@/types/finance';
import { formatDate } from "@/utils/helpers/format-date";

const props = defineProps<{
  data: Transaction[];
  branch: string;
  loading?: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredTransactions = computed(() => {
  if (props.branch === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branchId === props.branch
  );
});

// Ambil transaksi terbaru
const latestTransaction = computed(() => filteredTransactions.value[0]);

// Sisanya untuk list biasa
const listTransaction = computed(() => filteredTransactions.value.slice(1));
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Transaksi Terkini</h4>
          <div v-if="props.branch !== 'all'" class="ml-auto">
            <span class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction.branchName }}</span>
          </div>
        </div>
        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-5">
            <div class="pa-5">
              <div v-if="latestTransaction" class="d-inline-flex align-center justify-space-between w-100">
                <div>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(latestTransaction?.date) }}</span>
                  <h6 class="text-secondary text-h4 font-weight-bold">{{ latestTransaction?.name }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction?.subject }}</span>
                </div>
                <div>
                  <div class="text-right">
                    <span v-if="props.branch === 'all'" class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction?.branchName }}</span>  
                  </div>
                  <h4 v-if="latestTransaction?.type === 'income'" class="text-h4 text-success">+ {{ formatRupiah(latestTransaction?.price) }}</h4>
                  <h4 v-else class="text-h4 text-error">- {{ formatRupiah(latestTransaction?.price) }}</h4>
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4">
            <perfect-scrollbar v-bind:style="{ height: '180px' }">
              <v-list v-if="listTransaction.length > 0"  class="py-0">
                <v-list-item v-for="(listTransaction, i) in listTransaction" :key="i" :value="listTransaction" color="secondary" rounded="sm">
                  <div class="d-inline-flex align-center justify-space-between w-100">
                    <div>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(listTransaction?.date) }}</span>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold">
                        {{ listTransaction?.name }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listTransaction?.subject }}</span>
                    </div>
                    <div>
                      <div class="text-right">
                        <span v-if="props.branch === 'all'" class="text-subtitle-2 text-medium-emphasis">{{ listTransaction?.branchName }}</span>
                      </div>
                      <div v-if="listTransaction?.type === 'income'" class="ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold text-success">+ {{ formatRupiah(listTransaction?.price) }}</div>
                      <div v-else class="ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold text-error">- {{ formatRupiah(listTransaction?.price) }}</div>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                </v-list-item>
              </v-list>
            </perfect-scrollbar>
            
            <div class="text-center mt-3">
              <v-btn color="primary" variant="text" href="/transactions"
                >View All
                <template v-slot:append>
                  <ChevronRightIcon stroke-width="1.5" width="20" />
                </template>
              </v-btn>
            </div>
          </div>
        </div>
        <div v-else class="ml-auto">
          <!-- Skeleton Loading -->
          <v-skeleton-loader
            type="list-item-two-line"
            :loading="props.loading"
          ></v-skeleton-loader>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>