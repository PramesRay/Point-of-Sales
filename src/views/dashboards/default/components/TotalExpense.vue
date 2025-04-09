<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency'

const expensesData = {
  'Hari ini': 2324000,
  'Minggu ini': 12500000,
  'Bulan ini': 54000000,
  'Tahun ini': 650000000
};

const select = ref<{ state: 'Hari ini' | 'Minggu ini' | 'Bulan ini' | 'Tahun ini'}>({ state: 'Hari ini' });

const items = [
  { state: 'Hari ini' },
  { state: 'Minggu ini' },
  { state: 'Bulan ini' },
  { state: 'Tahun ini' }
];

// Data Chart berdasarkan pilihan
const chartData = {
  'Hari ini': {
    categories: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    series: [
      { name: 'Belanja Stok', data: [5, 15, 20, 30, 40, 50, 60, 70] },
      { name: 'Lain-lain', data: [3, 5, 10, 15, 20, 25, 30, 35] },
    
    ]
  },
  'Minggu ini': {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    series: [
      { name: 'Belanja Stok', data: [100, 200, 150, 250, 300, 350, 400] },
      { name: 'Lain-lain', data: [50, 60, 70, 80, 90, 100, 110] },
    
    ]
  },
  'Bulan ini': {
    categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    series: [
      { 
        name: 'Belanja Stok', 
        data: [1000, 1500, 1200, 1800]
      },
      { 
        name: 'Lain-lain', 
        data: [300, 400, 350, 500]
      }
    ]
  },
  'Tahun ini': {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    series: [
      { name: 'Belanja Stok', data: [500, 700, 800, 600, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600] },
      { name: 'Lain-lain', data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200] },
    
    ]
  }
} 

const totalPengeluaran = computed(() => {
  return expensesData[select.value.state as keyof typeof expensesData];
});


// Konfigurasi chart berdasarkan pilihan pengguna
const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 480,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      stacked: true
    },
    colors: ['#5e35b1', '#ede7f6'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: chartData[select.value.state].categories
    },
    legend: {
      show: true,
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    },
    tooltip: {
      theme: 'light'
    }
  };
});

// Data chart berdasarkan pilihan user
const lineChartSeries = computed(() => chartData[select.value.state].series);
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <span class="text-subtitle-2 text-disabled font-weight-bold">Total Pengeluaran</span>
            <h3 class="text-h3 mt-1">{{ formatRupiah(totalPengeluaran) }}</h3>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="select"
              :items="items"
              item-title="state"
              item-value="state"
              label="Select"
              return-object
              single-line
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="mt-4">
          <apexchart type="bar" height="480" :options="chartOptions" :series="lineChartSeries"> </apexchart>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>
