<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEmployeeActive } from '@/composables/useEmployeeActive'
import type { EmployeeActive } from '@/types/employeeActive';
import type { Employee } from '@/types/employee';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: EmployeeActive[];
  branch: IdName;
  loading: boolean;
}>();

const currentData = computed(() => {
  if (!props.data?.length) return undefined;
  return props.data.filter(tx => tx.branch.id === props.branch.id)[0]
})

const data = computed(() => currentData.value );

const tab = ref('1');

const currentSeries = computed(() => {
  const range = tab.value === "1" ? "week" : "month";

  return {
    series: [
      {
        name: 'series1',
        data: data.value?.[range]
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
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <BuildingStoreIcon stroke-width="1.5" width="25" />
        </v-btn>
        <div class="mx-3 my-auto">
          <span class="text-subtitle-2 text-medium-emphasis font-weight-medium text-white">{{ props.branch.name }}</span>
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
              <span class="mx-1"> {{ data?.active }} </span>
              <span class="text-body-2"> Aktif </span>
            </div>
          </h2>
          <span class="text-subtitle-1 text-medium-emphasis text-white">Pegawai</span>
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
          <!-- <v-skeleton-loader type="paragraf" color="transparant bg-primary"></v-skeleton-loader> -->
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>