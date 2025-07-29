<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { StockRequest } from '@/types/inventory';

import { getTimeDiff } from "@/utils/helpers/time";
import type { IdName } from '@/types/common';
import { useUserStore } from '@/stores/authUser';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import DetailStockRequest from './sub-components/DetailStockRequest.vue';
import CreateStockRequest from './sub-components/UpdateStockRequest.vue';
const userStore = useUserStore();
const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data: StockRequest[];
  branch: IdName | undefined | null;
  loading?: boolean;
  refresh: () => void
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  );
});

// Ambil permintaan terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const isChanged = ref(false)

function openAddRequest() {
  openOverlay({
    component: CreateStockRequest,
    props: {
      confirmBeforeClose: true,
      isChanged,
      refresh: props.refresh
    }
  })
}

function openDetail(request: StockRequest) {
  openOverlay({
    component: DetailStockRequest,
    props: {
      data: request
    }
  })
}
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div>
          <v-row class="justify-space-between">
            <v-col cols="8">
              <div class="d-flex align-center">
                <h4 class="text-h4 mt-1">Permintaan Stok Terkini</h4>
              </div>
              <div 
                v-if="props.branch && props.branch.id !== 'all' && !props.loading"
                class="text-subtitle-2 text-medium-emphasis"
              >{{ props.branch?.name }}
              </div> 
            </v-col>
            <v-col cols="4" class="mt-auto">
              <v-btn
                v-if="!loading"
                color="primary"
                @click="openAddRequest"
              >
                Tambah
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="!props.loading">
            <v-card class="bg-lightsecondary mt-5"
              @click="openDetail(latestRequest)"
            >
              <div v-if="latestRequest" class="pa-5">
                <span class="text-subtitle-2 text-disabled">
                  <span class="text-medium-emphasis" v-if="!props.branch">{{ latestRequest?.branch.name }}: </span>{{ latestRequest?.items.length }} item
                </span>
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-secondary text-h4 font-weight-bold">
                      {{ latestRequest?.meta.created_by.name }}
                    </h6>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <span v-if="latestRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestRequest?.status }}</span>
                      <span v-else-if="latestRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestRequest?.status }}</span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestRequest?.status }}</span>
                    </div>
                    <h4 class="text-h4 text-right">{{ getTimeDiff(latestRequest.meta.created_at) }}</h4>
                    <i v-if="latestRequest.meta.updated_at !== null" class="text-subtitle-2 text-medium-emphasis">
                      Diubah {{ getTimeDiff(latestRequest.meta.updated_at) }}
                    </i>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4">
              <perfect-scrollbar v-bind:style="{ maxHeight: mdAndUp? `30rem` : '12rem' }">
                <v-list v-if="listRequest.length > 0" class="py-0">
                  <v-list-item v-for="(listRequest, i) in listRequest" :key="i" :value="listRequest" color="secondary" rounded="sm" @click="openDetail(listRequest)">
                    <span class="text-subtitle-2 text-disabled">
                      <span class="text-medium-emphasis" v-if="!props.branch">{{ listRequest.branch.name }}: </span>{{ listRequest.items.length }} item
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                          {{ listRequest?.meta.created_by.name }}
                        </h6>
                        <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span>
                      </div>
                      <div>
                        <div class="d-flex justify-end">
                          <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                          <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                        </div>
                        <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeDiff(listRequest.meta.created_at) }}</div>
                        <i v-if="listRequest.meta.updated_at" class="text-subtitle-2 text-medium-emphasis">
                          Diubah {{ getTimeDiff(listRequest.meta.updated_at) }}
                        </i>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </perfect-scrollbar>

              <div class="text-center mt-3">
                <v-btn color="primary" variant="text" href="/StockRequestList"
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
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>