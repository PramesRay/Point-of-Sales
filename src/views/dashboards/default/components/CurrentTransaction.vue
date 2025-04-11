<script setup lang="ts">
import { formatRupiah } from '@/utils/helpers/currency'
import { ref, computed } from 'vue'

const transactions = ref([
  {
    name: 'Pelanggan',
    type: 'Pemesanan Menu',
    price: 150000,
    date: '2022-07-25'
  },
  {
    name: 'Pelanggan',
    type: 'Pemesanan Menu',
    price: 100000,
    date: '2022-07-25'
  },
  {
    name: 'Pegawai',
    type: 'Belanja Stok',
    price: 500000,
    date: '2022-07-25'
  },
  {
    name: 'Pegawai',
    type: 'Pengadaan Barang',
    price: 200000,
    date: '2022-07-25'
  },
  {
    name: 'Pegawai',
    type: 'Lain-lain',
    price: 100000,
    date: '2022-07-25'
  }
])

const latestTransaction = computed(() => transactions.value[0])
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Transaksi Terkini</h4>
          <div class="ml-auto">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                  <DotsIcon stroke-width="1.5" width="25" />
                </v-btn>
              </template>
              <v-sheet rounded="md" width="150" class="elevation-10">
                <v-list>
                  <v-list-item value="1">
                    <v-list-item-title>Today</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="2">
                    <v-list-item-title>This Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="3">
                    <v-list-item-title>This Year</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
          </div>
        </div>

        <v-card class="bg-lightsecondary mt-5">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction.date }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold">{{ latestTransaction.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction.type }}</span>
              </div>
              <h4 class="text-h4">{{ formatRupiah(latestTransaction.price) }}</h4>
            </div>
          </div>
        </v-card>
        <div class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(transactions, i) in transactions" :key="i" :value="transactions" color="secondary" rounded="sm">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ latestTransaction.date }}</span>
                    <h6 class="text-h4 text-medium-emphasis font-weight-bold">
                      {{ transactions.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ transactions.type }}</span>
                  </div>
                  <div class="ml-auto text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(transactions.price) }}</div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/transactions"
              >View All
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<!-- data yang ditampilkan pada card ungu dengan data pertama saat iterasi sama, seharusnya data pertama saat iterasi merupakan data kedua terbaru sehingga tidak memunculkan data yang sama dengan data pada card ungu -->