<script setup lang="ts">
import { formatRupiah } from '@/utils/helpers/currency'
import { ref, computed } from 'vue'

const fundRequests = ref([
  {
    request: 'Belanja Bahan',
    name: 'Khodijah',
    price: 1500000,
    date: '2022-07-25',
    status: 'Pending'
  },
  {
    request: 'Belanja Kebutuhan Dapur',
    name: 'Teddy',
    price: 50000,
    date: '2022-07-25',
    status: 'Pending'
  },
  {
    request: 'Print Banner',
    name: 'Ozi',
    price: 50000,
    date: '2022-07-25',
    status: 'Pending'
  },
  {
    request: 'Transportasi',
    name: 'Ujang',
    price: 200000,
    date: '2022-07-25',
    status: 'Ditolak'
  },
  {
    request: 'Belanja Kertas Resi',
    name: 'Silmi',
    price: 50000,
    date: '2022-07-25',
    status: 'Disetujui'
  }
])

const latestRequest = computed(() => fundRequests.value[0])
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
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
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest.date }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestRequest.request }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest.name }}</span>
              </div>
              <div>
                <div class="d-flex justify-end">  
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest.status }}</span>
                </div>
                <h4 class="text-h4">{{ formatRupiah(latestRequest.price) }}</h4>
              </div>
            </div>
          </div>
        </v-card>
        <div class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(fundRequests, i) in fundRequests" :key="i" :value="fundRequests" color="secondary" rounded="sm">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest.date }}</span>
                    <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                      {{ fundRequests.request }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ fundRequests.name }}</span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">
                      <span class="text-subtitle-2 text-medium-emphasis">{{ fundRequests.status }}</span>
                    </div>
                    <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(fundRequests.price) }}</div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/fundRequests"
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
<!-- tampilan harga tidak konsisten -->