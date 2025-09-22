<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Order } from '@/types/order';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: Order[];
  branch: IdName | undefined | null;
  loading: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  return props.data.filter(tx => tx.status === 'Diproses' || tx.status === 'Pending' || tx.status === 'Tersaji');
});

const currentOrder = computed(() => filteredData.value.length || 0);
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <BuildingStoreIcon stroke-width="1.5" width="25"/>
        </v-btn>
        <div class="mx-3 my-auto">
          <span class="text-subtitle-2 text-medium-emphasis font-weight-medium text-white">{{ props.branch ? props.branch?.name : 'Semua Cabang' }}</span>
        </div>
      </div>
      <v-row v-if="!props.loading">
        <v-col cols="12">
          <h2 class="text-h1 font-weight-medium d-flex align-center gap-1">
            <div class="d-flex align-baseline">
              <span class="mx-1"> {{ currentOrder }} </span>
              <span class="text-body-2"> Aktif </span>
            </div>
          </h2>
          <span class="text-subtitle-1 text-medium-emphasis text-white">Total Pesanan</span>
        </v-col>
      </v-row>
      <v-row v-if="props.loading">
        <v-col cols="12">
          <v-skeleton-loader type="paragraph" color="transparant bg-secondary"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card> 
</template>