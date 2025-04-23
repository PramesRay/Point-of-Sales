<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { formatRupiah } from '@/utils/helpers/currency'
import { useTimesheet } from '@/composables/useTimesheet'

const { data, branches, selectedBranch, init, loadingBranches, loadingTimesheet } = useTimesheet()

onMounted(() => {
  init();
});

// Data yang digunakan untuk tampilan
const currentData = computed(() => data.value ?? { open_hour: 0, employee: [] })

const longestEmployee = computed(() => {
  return currentData?.value?.employee?.length > 0 ? currentData.value.employee[0] : null
})

const listEmployee = computed(() => {
  return currentData?.value?.employee?.slice(1)
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
        <div v-if="loadingTimesheet|loadingBranches">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>
        
        <p v-if="!loadingTimesheet" class="text-subtitle-2 text-medium-emphasis mt-2 text-right">
          Restoran telah buka selama
          <b class="text-h4">{{ currentData?.open_hour }} Jam</b>
        </p>

        <v-card class="bg-lightsecondary mt-5" v-if="!loadingTimesheet">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-success text-medium-emphasis">{{ longestEmployee?.status }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ longestEmployee?.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ longestEmployee?.role }}</span>
              </div>
              <h4 class="text-h4">{{ longestEmployee?.active_hour + ' Jam'}}</h4>
            </div>
          </div>
        </v-card>

        <div class="mt-4" v-if="!loadingTimesheet">
          <perfect-scrollbar v-bind:style="{ height: '180px' }">
            <v-list lines="two" class="py-0">
              <v-list-item
                v-for="(list, i) in listEmployee"
                :key="i"
                :value="list"
                color="secondary"
                rounded="sm"
              >
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span
                      :class="[ 'text-subtitle-2 text-medium-emphasis', list.status === 'aktif' ? 'text-success' : '' ]"
                    >
                      {{ list.status }}
                    </span>
                    <h6
                      :class="[ 'text-h4 font-weight-bold', list.status === 'aktif' ? 'text-primary text-medium-emphasis' : 'text-medium-emphasis' ]"
                      style="max-width: 150px; overflow: hidden;"
                    >
                      {{ list.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ list.role }}</span>
                  </div>
                  <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">
                    {{ list.active_hour + ' Jam' }}
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/timesheets">
              Lihat Semua
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