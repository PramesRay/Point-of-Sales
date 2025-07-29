<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useStockRequests } from '@/composables/useStockRequest'
import type { StockRequestSummary } from '@/types/inventory';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: StockRequestSummary[];
  branch: IdName | undefined | null;
  loading: boolean;
}>();

const currentData = computed(() => {
  if (!props.branch) {
    return props.data[0]
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  )[0]
});

const tab = ref('1');

const branchName = computed(() => props.branch?.name || '-');
const currentRequest = computed(() => currentData.value?.summary.request || 0);

const currentSeries = computed(() => {
  const range = tab.value === "1" ? "week" : "month";

  return {
    series: [
      {
        name: 'series1',
        data: currentData.value?.summary[range]
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 90,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    tooltip: {
      theme: 'light',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Total Permintaan'
        }
      },
      marker: {
        show: false
      }
    }
  };
});
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <ShoppingCartIcon stroke-width="1.5" width="20" />
        </v-btn>
        <div v-if="!props.loading" class="mx-3 my-auto">
          <span class="text-subtitle-2 text-medium-emphasis font-weight-medium text-white">{{ branchName }}</span>
        </div>
        <div v-if="!props.loading" class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" align-tabs="end" color="transparant bg-secondary">
            <v-tab value="1" hide-slider >Minggu</v-tab>
            <v-tab value="2" hide-slider >Bulan</v-tab>
          </v-tabs>
        </div>
      </div>
      <v-row v-if="!props.loading">
        <v-col cols="6">
            <h2 class="text-h1 font-weight-medium d-flex align-center gap-1">
              <div class="d-flex align-baseline">
                <span class="mx-1"> {{ currentRequest }} </span>
                <span class="text-body-2"> Aktif</span>
              </div>
              <a href="#">
                <CircleArrowDownLeftIcon stroke-width="1.5" width="28" class="text-white ml-2" />
              </a>
            </h2>
            <span class="text-subtitle-1 text-medium-emphasis text-white">Permintaan Stok</span>
          </v-col>
        <v-col cols="6">
          <v-tabs-window v-model="tab" class="z-1">
            <v-tabs-window-item value="1">
              <apexchart type="line" height="90" :options="chartOptions" :series="currentSeries?.series"></apexchart>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
              <apexchart type="line" height="90" :options="chartOptions" :series="currentSeries?.series"> </apexchart>
            </v-tabs-window-item>
          </v-tabs-window>
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