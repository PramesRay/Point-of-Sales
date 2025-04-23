<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useTotalOrder } from '@/composables/useTotalOrder'
import type { EmployeeActive } from '@/types/employeeActive';

const tab = ref('1');
const { data, branches, selectedBranch, init, loadingBranches, loadingData } = useTotalOrder()

onMounted(() => {
  init();
});

const currentData = computed(() => data.value ?? { active: 0, week: [], month: []})

const currentSeries = computed(() => {
  if (!branches) return { series: [] };
  
  const range = tab.value === "1" ? "week" : "month";

  return {
    series: [
      {
        name: 'series1',
        data: currentData?.value?.[range]
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
    yaxis: {
      min: 0,
      max: 16 // perlu diganti jadi (max number in data + 1)
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
          formatter: () => 'Pegawai Aktif'
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
        <div class="mx-3">
          <v-select
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
          </v-select>
        </div>
        <div v-if="!loadingData" class="ml-auto z-1">
          <v-tabs v-model="tab" class="theme-tab" density="compact" align-tabs="end" color="transparant bg-primary">
            <v-tab value="1" hide-slider >Minggu</v-tab>
            <v-tab value="2" hide-slider >Bulan</v-tab>
          </v-tabs>
        </div>
      </div>
      <v-row v-if="!loadingData">
        <v-col cols="6">
            <h2 class="text-h1 font-weight-medium d-flex align-center gap-1">
              <div class="d-flex align-baseline">
                <span class="mx-1"> {{ currentData?.current }} </span>
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
      <v-row v-if="loadingData & !loadingBranches">
        <v-col cols="12">
          <v-skeleton-loader type="paragraph" color="transparant bg-primary"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card> 
</template>