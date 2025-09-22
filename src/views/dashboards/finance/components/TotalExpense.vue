<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency';
import type { FinanceSummary } from '@/types/finance';
import { ChevronDownIcon, ChevronUpIcon } from 'vue-tabler-icons';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: FinanceSummary;
  branch: IdName | undefined | null;
  loading: boolean;
}>();

const select = ref<'Hari ini' | 'Minggu ini' | 'Bulan ini' | 'Tahun ini'>('Minggu ini');
const showChart = ref(true);

const timeRangeMapping = {
  'Hari ini': 'today',
  'Minggu ini': 'week',
  'Bulan ini': 'month',
  'Tahun ini': 'year'
} as const;

const items = ['Hari ini', 'Minggu ini', 'Bulan ini', 'Tahun ini'];

const branchExpenseData = computed(() => {
  console.log('props.data', props.data)
  if (!props.data) return undefined;
  return props.data.expenses;
});

const isReady = computed(() => {
  return !!branchExpenseData.value && !!branchExpenseData.value.chartData;
});

const totalExpense = computed(() => {
  if (!isReady.value) return 0;
  const key = timeRangeMapping[select.value];
  return branchExpenseData.value?.totalExpenses?.[key] ?? 0;
});

const chartData = computed(() => {
  if (!isReady.value) return { categories: [], series: [] };
  const key = timeRangeMapping[select.value];
  return branchExpenseData.value?.chartData[key] || { categories: [], series: [] };
});

const hasValidChartData = computed(() => {
  return (
    chartData.value &&
    Array.isArray(chartData.value.series) &&
    chartData.value.series.length > 0
  );
});

const chartOptions = computed(() => {
  if (!isReady.value || !hasValidChartData.value) {
    return {};
  }
  return {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      foreColor: '#a1aab2',
      stacked: true,
    },
    colors: ['#5e35b1', '#ede7f6'],
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%' }
    },
    xaxis: {
      type: 'category',
      categories: chartData.value.categories || []
    },
    legend: {
      show: true,
      fontFamily: 'Roboto, sans-serif',
      position: 'bottom',
      offsetX: 20,
      labels: { useSeriesColors: false },
      markers: { width: 16, height: 16, radius: 5 },
      itemMargin: { horizontal: 15, vertical: 8 }
    },
    fill: { type: 'solid' },
    dataLabels: { enabled: false },
    grid: { show: true },
    tooltip: { theme: 'light' }
  };
});

const lineChartSeries = computed(() => chartData.value.series ?? []);

const chartHeight = ref(480);
const updateChartHeight = () => {
  chartHeight.value = window.innerWidth < 600 ? 300 : 480;
};

onMounted(() => {
  updateChartHeight();
  window.addEventListener('resize', updateChartHeight);
  // if (isReady.value && hasValidChartData.value) {
  //   showChart.value = false; 
  // }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateChartHeight);
});
</script>

<template>
  <div>
    <v-card 
      elevation="0"
    >
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="5" class="d-flex align-center">
            <div>
              <span class="text-subtitle-1 text-medium-emphasis  font-weight-bold">Total Pengeluaran <span class="text-subtitle-2 text-disabled" v-if="props.branch?.id !== 'all' && !props.loading">: {{ props.branch?.name }}</span></span>
              <h3 class="text-h3 mt-1">
                {{ formatRupiah(totalExpense) }}
              </h3>
            </div>
          </v-col>
          
          <v-col cols="12" sm="7">
            <div class="d-flex align-center my-2">
              <v-select
                class="mx-2"
                color="primary"
                variant="outlined"
                hide-details
                v-model="select"
                :items="items"
                label="Pilih Waktu"
                single-line
              />
              <v-btn
                icon
                size="small"
                :variant="showChart ? 'tonal' : 'text'"
                @click="showChart = !showChart"
              >
                <v-icon :opacity="showChart ? 1 : 0.5">mdi-poll</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="showChart" justify="center" no-gutters>
          <v-col cols="12">
            <v-expand-transition v-show="showChart">
              <v-progress-circular
                v-if="props.loading"
                height="4"
                indeterminate
                color="secondary"
                class="mb-4"
              />
              <apexchart
                v-else-if="isReady && hasValidChartData"
                :key="`${props.branch}-${select}`"
                type="bar"
                :height="chartHeight"
                :options="chartOptions"
                :series="lineChartSeries"
              />
              <div v-else class="text-center text-medium-emphasis mt-5">
                Tidak ada data untuk periode ini.
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>