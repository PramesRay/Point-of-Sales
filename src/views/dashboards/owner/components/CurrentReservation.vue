<script setup lang="ts">
import { formatDate } from '@/utils/helpers/format-date'
import { ref, computed, onMounted } from 'vue'
import { useReservation } from "@/composables/useReservation";

const { data, branches, selectedBranch, init, loadingBranches, loadingData } = useReservation()

onMounted(() => {
  init();
});

// Data yang digunakan untuk tampilan
const currentData = computed(() => data.value ?? { customer: {}, date: 0, time: '', status: '', people: 0 })

const urgentReservation = computed(() => {
  if (Array.isArray(currentData.value)) {
    return currentData.value.length > 0 ? currentData.value[0] : null
  } else {
    return null
  }
})

const listReservation = computed(() => {
  if (Array.isArray(currentData.value)) {
    return currentData.value.slice(1)
  } else {
    return []
  }
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <h4 class="text-h4 mt-1">Kehadiran Pegawai</h4>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="selectedBranch"
              :items="branches"
              item-title="name"
              item-value="id"
              label="Pilih Restoran"
              :loading="loadingBranches"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="loadingData|loadingBranches">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <v-card v-if="!loadingData" class="bg-lightsecondary mt-5">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(urgentReservation.date) }} : {{ urgentReservation.time }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ urgentReservation.customer.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ urgentReservation.customer.phone }}</span>
              </div>
              <div>
                <div class="d-flex justify-end">  
                  <span v-if="urgentReservation.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ urgentReservation.status }}</span>
                  <span v-else-if="urgentReservation.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ urgentReservation.status }}</span>
                  <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ urgentReservation.status }}</span>
                </div>
                <h4 class="text-h4">{{ urgentReservation.people }} Orang</h4>
              </div>
            </div>
          </div>
        </v-card>
        <div v-if="!loadingData" class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '180px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(listReservation, i) in listReservation" :key="i" :value="listReservation" color="secondary" rounded="sm">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(listReservation.date) }} : {{ listReservation.time }}</span>
                    <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                      {{ listReservation.customer.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ listReservation.customer.phone }}</span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">
                      <span v-if="listReservation.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listReservation.status }}</span>
                      <span v-else-if="listReservation.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listReservation.status }}</span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listReservation.status }}</span>
                    </div>
                    <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ listReservation.people }} Orang</div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/reservations"
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