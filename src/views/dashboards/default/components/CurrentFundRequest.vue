<script setup lang="ts">
import type { FundRequest } from '@/types/finance';
import { formatRupiah } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";
import { ref, computed } from 'vue'

const props = defineProps<{
  data: FundRequest[];
  branch: string;
  loading?: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (props.branch === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branchId === props.branch
  );
});

// Ambil transaksi terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div v-if="!props.loading">
          <div class="d-flex align-center">
            <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
            <div v-if="props.branch !== 'all'" class="ml-auto">
              <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branchName }}</span>
            </div>
            <!-- <div class="ml-auto">
              <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                    <DotsIcon stroke-width="1.5" width="25" />
                  </v-btn>
                </template>
                <v-sheet rounded="md" width="150" class="elevation-10">
                  <v-list>
                    <v-list-item value="1">
                      <v-list-item-title>Today</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="2">
                      <v-list-item-title>This Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="3">
                      <v-list-item-title>This Year</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-menu>
            </div> -->
          </div>

          <v-card class="bg-lightsecondary mt-5">
            <div v-if="latestRequest" class="pa-5">
              <span class="text-subtitle-2 text-medium-emphasis">
                <span v-if="props.branch === 'all'">{{ latestRequest?.branchName }}</span> : {{ formatDate(latestRequest?.date) }}
              </span>
              <div class="d-inline-flex align-center justify-space-between w-100">
                <div>
                  <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestRequest?.request }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.name }}</span>
                </div>
                <div>
                  <div class="d-flex justify-end">  
                    <span v-if="latestRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestRequest?.status }}</span>
                    <span v-else-if="latestRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestRequest?.status }}</span>
                    <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestRequest?.status }}</span>
                  </div>
                  <h4 class="text-h4">{{ formatRupiah(latestRequest?.price) }}</h4>
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4">
            <perfect-scrollbar v-bind:style="{ height: '180px' }">
              <v-list v-if="listRequest.length > 0" class="py-0">
                <v-list-item v-for="(listRequest, i) in listRequest" :key="i" :value="listRequest" color="secondary" rounded="sm">
                  <span class="text-subtitle-2 text-medium-emphasis">
                    <span v-if="props.branch === 'all'">{{ listRequest?.branchName }}</span> : {{ formatDate(listRequest?.date) }}
                  </span>
                  <div class="d-inline-flex align-center justify-space-between w-100">
                    <div>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                        {{ listRequest?.request }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listRequest?.name }}</span>
                    </div>
                    <div>
                      <div class="d-flex justify-end">
                        <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                        <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                        <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(listRequest?.price) }}</div>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                </v-list-item>
              </v-list>
            </perfect-scrollbar>

            <div class="text-center mt-3">
              <v-btn color="primary" variant="text" href="/fundRequests"
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