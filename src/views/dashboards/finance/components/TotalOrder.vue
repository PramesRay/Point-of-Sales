<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useTotalOrder } from '@/composables/useTotalOrder'
import type { FinanceSummary } from '@/types/finance';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: FinanceSummary[];
  branch: IdName | undefined;
  loading: boolean;
}>();

const orderData = computed(() => {
  if (!props.data?.length) return undefined;
  return props.data
    .filter(tx => tx.branchId === (props.branch?.id || 'all'))
    .map(item => ({order: item.order}))[0]
});

const tab = ref('1');

const currentOrder = computed(() => orderData.value?.order.current || 0);

const currentSeries = computed(() => {
  const range = tab.value === "1" ? "week" : "month";

  return {
    series: [
      {
        name: 'series1',
        data: orderData.value?.order[range]
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
          formatter: () => 'Total Order'
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
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-primary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darkprimary" variant="flat">
          <ShoppingCartIcon stroke-width="1.5" width="20" />
        </v-btn>
        <div class="mx-3 my-auto">
          <!-- <v-select
              class="custom-select font-weight-medium"
              variant="plain"
              hide-details
              density="compact"
              v-model="selectedBranch"
              :items="branches"
              item-title="name"
              item-value="id"
              label="Pilih Restoran"
              :loading="loadingBranches"
              :return-object="false"
              single-line
            >
          </v-select> -->
          <span class="text-subtitle-2 text-medium-emphasis font-weight-medium text-white">{{ props.branch?.name }}</span>
        </div>
        <div v-if="!props.loading" class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" align-tabs="end" color="transparant bg-primary">
            <v-tab value="1" hide-slider >Minggu</v-tab>
            <v-tab value="2" hide-slider >Bulan</v-tab>
          </v-tabs>
        </div>
      </div>
      <v-row v-if="!props.loading">
        <v-col cols="6">
            <h2 class="text-h1 font-weight-medium d-flex align-center gap-1">
              <div class="d-flex align-baseline">
                <span class="mx-1"> {{ currentOrder }} </span>
                <span class="text-body-2"> Pesanan</span>
              </div>
              <a href="#">
                <CircleArrowDownLeftIcon stroke-width="1.5" width="28" class="text-white ml-2" />
              </a>
            </h2>
            <span class="text-subtitle-1 text-medium-emphasis text-white">Total Pesanan</span>
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
          <v-skeleton-loader type="paragraph" color="transparant bg-primary"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card> 
</template>