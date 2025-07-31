<script setup lang="ts">
import { formatRupiah } from '@/utils/helpers/currency'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import DetailTransaction from './sub-component/DetailTransaction.vue';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
const { openOverlay } = useOverlayManager()


import type { Transaction } from '@/types/finance';
import type { IdName } from '@/types/common';

import { formatDate } from "@/utils/helpers/format-date";

const props = defineProps<{
  data: Transaction[];
  branch: IdName | undefined | null;
  branches: IdName[];
  loading?: boolean;
}>();

const isChanged = ref(false)

// Computed untuk filter transaksi berdasarkan branch
const filteredTransactions = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return []; // Return an empty array if data is not available or not an array
  }
  
  if (!props.branch || props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  );
});

// Ambil transaksi terbaru
const latestTransaction = computed(() => filteredTransactions.value[0]);

// Sisanya untuk list biasa
const listTransaction = computed(() => filteredTransactions.value.slice(1));
</script>

<template>
  <v-card elevation="0" style="height: fit-content;">
    <v-card-text>
      <v-row align="center" no-gutters>
        <v-col cols="8">
          <h4 class="text-h4 mt-1">Transaksi Terkini</h4>
          <span v-if="props.branch && props.branch.id !== 'all' && !props.loading" class="text-subtitle-2 text-medium-emphasis">
            {{ props.branch?.name }}
          </span>
        </v-col>
        <v-col cols="4" class="mt-auto text-right">
          <v-btn
            v-if="!props.loading"
            color="primary"
            @click="openOverlay({
              component: DetailTransaction,
              props: {
                branches: props.branches,
                is_create: true,
                confirmBeforeClose: true,
                isChanged
              }
            })"
          >
            Tambah
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="!props.loading">
        <v-col cols="12">
          <v-card 
            class="bg-lightsecondary mt-4"
            @click="openOverlay({
              component: DetailTransaction,
              props: {
                branches: props.branches,
                data: latestTransaction,
                is_create: false,
                confirmBeforeClose: true,
                isChanged
              }
            })"
          >
            <div v-if="latestTransaction" class="pa-5">
              <span class="text-subtitle-2 text-medium-emphasis text-disabled">
                {{ formatDate(latestTransaction?.date).replace('pukul', ':') }}
              </span>
              <v-row class="mt-2" align="center" justify="space-between" no-gutters>
                <v-col cols="7">
                  <h4 
                    class="text-secondary text-h4 font-weight-bold"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                    @wheel.stop @touchmove.stop @scroll.stop
                  >
                    {{ latestTransaction?.subject }}
                  </h4>
                  <div
                    style="max-height: 3rem; overflow: auto; scrollbar-width: none;"
                    @wheel.stop @touchmove.stop @scroll.stop
                  >
                    <i class="text-subtitle-2 text-disabled">
                      {{ latestTransaction?.notes || '-' }}
                    </i>
                  </div>
                </v-col>
                <v-col cols="5" class="text-right ps-1">
                  <span v-if="!props.branch" class="text-subtitle-2 text-disabled">
                    {{ latestTransaction?.branch.name }}
                  </span>
                  <h4 
                    v-if="latestTransaction?.is_income" 
                    class="text-h4 text-success"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                  >
                    + {{ formatRupiah(latestTransaction?.amount) }}
                  </h4>
                  <h4 
                    v-else 
                    class="text-h4 text-error"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                  >
                    - {{ formatRupiah(latestTransaction?.amount) }}
                  </h4>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" class="mt-4">
          <ScrollContainer :style="{ maxHeight: mdAndUp ? '25rem' : '12rem' }">
            <v-list v-if="listTransaction.length > 0" class="py-0">
              <v-list-item
                v-for="(data, i) in listTransaction"
                :key="i"
                :value="data"
                color="secondary"
                rounded="sm"
                @click="() => {
                  openOverlay({
                    component: DetailTransaction,
                    props: { 
                      branches: props.branches,
                      data: data,
                      is_create: false,
                      confirmBeforeClose: true,
                      isChanged
                    },
                  })
                }
                "
              >
                <span class="text-subtitle-2 text-medium-emphasis text-disabled">
                  {{ formatDate(data?.date).replace('pukul', ':') }}
                </span>
                <v-row class="mt-2" align="center" justify="space-between" no-gutters>
                <v-col cols="7">
                  <h4 
                    class="text-h4 text-medium-emphasis font-weight-bold"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                    @wheel.stop @touchmove.stop @scroll.stop
                  >
                    {{ data?.subject }}
                  </h4>
                  <div
                    style="max-height: 3rem; overflow: auto; scrollbar-width: none;"
                    @wheel.stop @touchmove.stop @scroll.stop
                  >
                    <i class="text-subtitle-2 text-disabled">
                      {{ data?.notes || '-' }}
                    </i>
                  </div>
                </v-col>
                <v-col cols="5" class="text-right ps-1">
                  <span v-if="!props.branch" class="text-subtitle-2 text-disabled">
                    {{ data?.branch.name }}
                  </span>
                  <h4 
                    v-if="data?.is_income" 
                    class="text-h4 text-success"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                  >
                    + {{ formatRupiah(data?.amount) }}
                  </h4>
                  <h4 
                    v-else 
                    class="text-h4 text-error"
                    style="overflow: auto; text-overflow: clip; white-space: nowrap; scrollbar-width: none;"
                  >
                    - {{ formatRupiah(data?.amount) }}
                  </h4>
                </v-col>
              </v-row>
                <v-divider class="my-3" />
              </v-list-item>
            </v-list>
          </ScrollContainer>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/transactions">
              View All
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="ml-auto">
          <v-skeleton-loader
            type="list-item-two-line"
            :loading="props.loading"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  
</template>