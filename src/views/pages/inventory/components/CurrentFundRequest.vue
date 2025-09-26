<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { formatRupiah } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";

import type { FundRequest } from '@/types/finance';
import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import UpdateFundRequest from './sub-components/fund-request/UpdateFundRequest.vue';
import DetailFundRequest from './sub-components/fund-request/DetailFundRequest.vue';
import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import { useUserStore } from '@/stores/authUser';

const { openOverlay } = useOverlayManager()
const userStore = useUserStore()

const props = defineProps<{
  data: FundRequest[];
  loading?: boolean;
  refresh: () => void
}>();

// Computed untuk filter transaksi berdasarkan branch
const currentData = computed(() => props.data);

// Ambil permintaan terbaru
const latestRequest = computed(() => currentData?.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => currentData?.value.slice(1));

const isChanged = ref(false)

function openAddRequest() {
  openOverlay({
    component: UpdateFundRequest,
    props: {
      is_create: true,
      confirmBeforeClose: true,
      isChanged,
      refresh: props.refresh
    }
  })
}

function openDetail(request: FundRequest) {
  openOverlay({
    component: DetailFundRequest,
    props: {
      data: request,
      refresh: props.refresh
    }
  })
  //   if (userStore.me?.activity?.shift_op_id !== request.shift_warehouse_id || request.status !== 'Pending') {
  //     alertStore.showAlert('Data permintaan sudah tidak dapat diubah', 'warning')
  //     return
  //   } else {
  //     openOverlay({
  //       component: UpdateFundRequest,
  //       props: {
  //         data: request,
  //         refresh: props.refresh
  //       }
  //     })
  //   }
}
</script>

<template>
  <v-card elevation="0" style="height: fit-content;">
    <v-card variant="outlined">
      <v-card-text>
        <v-row align="baseline">
          <v-col cols="8">
            <div class="d-flex align-center">
              <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
            </div> 
          </v-col>
          <v-col cols="4" class="mt-auto text-right">
            <v-btn
              v-if="!loading && userStore.hasRole(['admin', 'pemilik', 'gudang'])"
              color="primary"
              @click="openAddRequest"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>
          
        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-6" @click="openDetail(latestRequest)">
            <div v-if="latestRequest" class="pa-5">
              <span class="text-subtitle-2 text-disabled">
                {{ latestRequest.meta?.created_at ? `${formatDate(latestRequest.meta?.created_at).slice(0,-11)}: ${formatDate(latestRequest.meta?.created_at).slice(-5)}` : '' }}
              </span>
              <v-row no-gutters>
                <v-col cols="7" class="pe-1">
                  <h6 class="text-secondary text-h4 font-weight-bold" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">{{ latestRequest?.subject }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.meta.created_by.name }}</span>
                </v-col>
                <v-col cols="5" class="text-right">
                  <span
                    :class="{
                      'text-subtitle-2 text-medium-emphasis text-warning': latestRequest?.status === 'Pending',
                      'text-subtitle-2 text-medium-emphasis text-success': latestRequest?.status === 'Disetujui' || latestRequest?.status === 'Beberapa Disetujui',
                      'text-subtitle-2 text-medium-emphasis text-error': latestRequest?.status === 'Ditolak',
                      'text-subtitle-2 text-medium-emphasis text-primary': latestRequest?.status === 'Selesai',
                    }"
                  >{{ latestRequest?.status }}</span>
                  <h5 class="text-h5 text-medium-emphasis font-weight-bold">{{ formatRupiah(latestRequest?.amount) }}</h5>
                </v-col>
              </v-row>
            </div>
          </v-card>
          <div class="mt-4">
            <ScrollContainer :style="{ maxHeight: mdAndUp? '30rem' : '18rem'}">
              <v-list v-if="listRequest.length > 0" class="py-0">
                <v-list-item 
                  v-for="(listRequest, i) in listRequest" 
                  :key="i" 
                  :value="listRequest" 
                  color="secondary" 
                  rounded="sm"
                  @click="openDetail(listRequest)"
                >
                  <v-divider v-if="i !== 0" class="my-3" />
                  <span class="text-subtitle-2 text-disabled">
                    {{ listRequest.meta?.created_at ? `${formatDate(listRequest.meta?.created_at).slice(0,-11)}: ${formatDate(listRequest.meta?.created_at).slice(-5)}` : '' }}
                  </span>
                  <v-row no-gutters>
                    <v-col cols="7" class="pe-1">
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">
                        {{ listRequest?.subject }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listRequest?.meta.created_by.name }}</span>
                    </v-col>
                    <v-col cols="5" class="text-right">
                      <span
                        :class="{
                          'text-subtitle-2 text-medium-emphasis text-warning': listRequest?.status === 'Pending',
                      'text-subtitle-2 text-medium-emphasis text-success': listRequest?.status === 'Disetujui' || listRequest?.status === 'Beberapa Disetujui',
                      'text-subtitle-2 text-medium-emphasis text-error': listRequest?.status === 'Ditolak',
                      'text-subtitle-2 text-medium-emphasis text-primary': listRequest?.status === 'Selesai',
                        }"
                      >{{ listRequest?.status }}</span>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(listRequest?.amount) }}</div>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
              <!-- jika data kosong -->
            </ScrollContainer>
          </div>
          <div v-if="!listRequest.length && !latestRequest" class="text-center text-subtitle-2 text-disabled mt-4">
            Data Permintaan Dana tidak ditemukan
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

<style>
.small-font .v-field__input {
  font-size: 0.8rem !important;
}

/* style css kecuali untuk v-icon */
.small-placeholder .v-field {
  font-size: 0.8rem !important;
}

.small-placeholder .v-icon {
  font-size: 1.5rem !important;
}
</style>