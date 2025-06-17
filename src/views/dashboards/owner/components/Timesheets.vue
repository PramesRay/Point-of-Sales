<script setup lang="ts">
import type { IdName } from '@/types/common';
import type { TimesheetData } from '@/types/timesheet';
import { getTimeDiff } from '@/utils/helpers/time';
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

const props = defineProps<{
  data: TimesheetData[];
  branch: IdName;
  loading: boolean;
}>();

// Data yang digunakan untuk tampilan
const currentData = computed(() => {
  if (props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch.id
  );
})

const longestEmployee = computed(() => currentData.value[0].employee[0])
const listEmployee = computed(() => currentData.value[0].employee.slice(1))
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <h4 class="text-h4 mt-1">Kehadiran Pegawai
              <span 
                class="text-subtitle-2 text-medium-emphasis ml-1" 
                v-if="props.branch.id !== 'all'"
              >
              {{ props.branch.name }}</span>
            </h4>
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <!-- <v-skeleton-loader type="paragraph"></v-skeleton-loader> -->
          <!-- <v-skeleton-loader type="paragraph"></v-skeleton-loader> -->
        </div>
        
        <p v-if="!props.loading" class="text-subtitle-2 text-medium-emphasis mt-2 text-right">
          Restoran telah buka selama
          <b class="text-h4">{{ currentData[0]?.open_hour }} Jam</b>
        </p>

        <v-card class="bg-lightsecondary " v-if="!props.loading">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-success text-medium-emphasis">{{ longestEmployee?.activity.is_active ? 'Aktif' : 'Tidak Aktif' }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ longestEmployee?.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ longestEmployee?.role[0] }}</span>
              </div>
              <div v-if="!longestEmployee.activity.is_active" class="text-right">
                <span class="text-subtitle-2 text-medium-emphasis">Aktif</span>
                <h4 class="text-h4">{{ getTimeDiff(longestEmployee?.activity.last_active!)}}</h4>
              </div>
              <div v-else class="text-right">
                <h4 class="text-h4">{{ getTimeDiff(longestEmployee?.activity.last_active!).slice(0, -5)}}</h4>
              </div>
            </div>
          </div>
        </v-card>

        <div class="mt-4" v-if="!props.loading">
          <perfect-scrollbar :style="{ maxHeight: mdAndUp? '25rem' : '12rem'}">
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
                      :class="[ 'text-subtitle-2 text-medium-emphasis', list.activity.is_active ? 'text-success' : '' ]"
                    >
                      {{ list.activity.is_active ? 'Aktif' : 'Tidak Aktif' }}
                    </span>
                    <h6
                      :class="[ 'text-h4 font-weight-bold', list.activity.is_active ? 'text-primary text-medium-emphasis' : 'text-medium-emphasis' ]"
                    >
                      {{ list.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ list.role[0] }}</span>
                  </div>
                  <div v-if="!list.activity.is_active" class="text-right">
                    <span class="text-subtitle-2 text-medium-emphasis">Aktif</span>
                    <h4 class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ getTimeDiff(list?.activity.last_active!)}}</h4>
                  </div>
                  <div v-else class="text-right">
                    <h4 class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ getTimeDiff(list?.activity.last_active!).slice(0, -5)}}</h4>
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