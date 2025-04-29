<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency';
import type { FinanceSummary } from '@/types/finance';
import { ChevronDownIcon, ChevronUpIcon } from 'vue-tabler-icons';

const props = defineProps<{
  data: FinanceSummary[];
  branch: string;
  loading: boolean;
}>();

const select = ref<'Hari ini' | 'Minggu ini' | 'Bulan ini' | 'Tahun ini'>('Hari ini');
const showChart = ref(false);

const timeRangeMapping = {
  'Hari ini': 'today',
  'Minggu ini': 'week',
  'Bulan ini': 'month',
  'Tahun ini': 'year'
} as const;

const items = ['Hari ini', 'Minggu ini', 'Bulan ini', 'Tahun ini'];

const branchExpenseData = computed(() => {
  if (!props.data?.length) return undefined;
  return props.data.find(exp => exp.branchId === props.branch)?.expense;
});

const isReady = computed(() => {
  return !!branchExpenseData.value && !!branchExpenseData.value.chartData;
});

const totalExpense = computed(() => {
  if (!isReady.value) return 0;
  const key = timeRangeMapping[select.value];
  return branchExpenseData.value?.totalExpense?.[key] ?? 0;
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
  if (isReady.value && hasValidChartData.value) {
    showChart.value = true; 
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateChartHeight);
});
</script>

<template>
  <v-card elevation="0" :loading="props.loading">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <span class="text-subtitle-2 text-disabled font-weight-bold">Total Pengeluaran</span>
                <h3 class="text-h3 mt-1">
                  {{ formatRupiah(totalExpense) }}
                </h3>
              </div>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="showChart = !showChart"
              >
                <component :is="showChart ? ChevronUpIcon : ChevronDownIcon" width="20" />
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="select"
              :items="items"
              label="Pilih Waktu"
              single-line
            />
          </v-col>
        </v-row>

        <v-expand-transition >
          <div v-if="showChart" class="mt-4">
            <v-skeleton-loader
              v-if="props.loading"
              type="card"
              height="300"
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
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </v-card>
</template>