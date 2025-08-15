<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import type { IdName } from '@/types/common';
import type { Reservation } from '@/types/reservation';

import { formatDate } from '@/utils/helpers/format-date'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import UpdateReservation from './sub-components/reservation/UpdateReservation.vue';
import ScrollContainer from '@/components/shared/ScrollContainer.vue';
const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data: Reservation[];
  branch: IdName | undefined | null;
  branch_option: IdName[]
  loading: boolean;

  refresh: () => void;
}>();

const isChanged = ref(false)

// Data yang digunakan untuk tampilan
const currentData = computed(() => {
  console.log('props.data', props.data)
  if (!props.branch || props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  );
})
const latestReservation = computed(() => currentData.value[0])
const listReservation = computed(() => currentData.value.slice(1))

function openAddNew() {
  openOverlay({
    component: UpdateReservation,
    props: {
      is_create: true,
      branches: props.branch_option,

      isChanged,
      confirmBeforeClose: true,
      onIsChangedUpdate: (val: boolean) => isChanged.value = val,
      refresh: props.refresh
    }
  })
}

function openDetail(data: Reservation) {
  openOverlay({
    component: UpdateReservation,
    props: {
      data: data,
      branches: props.branch_option,

      isChanged,
      confirmBeforeClose: true,
      refresh: props.refresh
    }
  })
}
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <div>
              <h4 class="text-h4 mt-1">Daftar Reservasi</h4>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis"
              v-if="props.branch?.id !== 'all'"
              >{{ props.branch?.name }}
            </div>
          </v-col>
          <v-col cols="5" class="mt-auto text-right">
            <v-btn
              v-if="!props.loading"
              color="primary"
              @click="openAddNew"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <v-card v-if="!props.loading && latestReservation" class="bg-lightsecondary mt-5" @click="openDetail(latestReservation)">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(latestReservation?.time).slice(0, -12) || '-'}}: {{ formatDate(latestReservation?.time).slice(-6) || '-'}}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestReservation?.customer.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestReservation?.customer.phone }}</span>
              </div>
              <div>
                <div class="d-flex justify-end">  
                  <span v-if="latestReservation?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestReservation?.status }}</span>
                  <span v-else-if="latestReservation?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestReservation?.status }}</span>
                  <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestReservation?.status }}</span>
                </div>
                <h4 class="text-h4">{{ latestReservation?.people }} Orang</h4>
              </div>
            </div>
          </div>
        </v-card>
        <div v-if="!props.loading" class="my-4">
          <ScrollContainer :style="{ maxHeight: '18rem'}">
            <v-list lines="two" class="py-0" v-if="listReservation.length > 0">
              <v-list-item 
                v-for="(listReservation, i) in listReservation" 
                :key="i" 
                :value="listReservation" 
                color="secondary" 
                rounded="sm" 
                @click="openDetail(listReservation)"
              >
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(listReservation.time).slice(0, -12) }}: {{ formatDate(listReservation.time).slice(-6) }}</span>
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
            <div v-else class="text-center text-subtitle-2 text-disabled mt-4">
              Belum ada data reservasi
            </div>
          </ScrollContainer>

          <!-- <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/reservations"
              >View All
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div> -->
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style>
.small-font .v-field__input {
  font-size: 0.8rem !important;
}
</style>