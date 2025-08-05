<script setup lang="ts">
import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import type { IdName } from '@/types/common';
import type { TimesheetData } from '@/types/timesheet';
import { getTimeDiff } from '@/utils/helpers/time';
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

const props = defineProps<{
  data: TimesheetData[];
  branch: IdName | undefined | null;
  loading: boolean;
}>();

// Data yang digunakan untuk tampilan
const currentData = computed(() => {
  if (!props.branch || props.branch.id === 'all') {
    console.log('props.data', props.data)
    return props.data;
  } 

  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  );
})

const employeeData = computed(() => {
  console.log('currentData', currentData.value)
  console.log('current Data Flat Map', currentData.value.flatMap((tx) => tx.employee))
  return currentData.value.flatMap((tx) => tx.employee);
});

const sortedEmployee = computed(() => {
  // Pisahkan pegawai yang aktif dan tidak aktif
  const activeEmployees = employeeData.value.filter(emp =>emp.activity && emp.activity?.is_active)  // Pastikan activity ada sebelum mengakses is_active
  const inactiveEmployees = employeeData.value.filter(emp => emp.activity &&!emp.activity?.is_active)  // Pastikan activity ada sebelum mengakses is_active

  // Urutkan pegawai yang aktif berdasarkan durasi aktivitas paling lama
  activeEmployees.sort((a, b) => {
    const lastActiveA = a.activity?.last_active ? new Date(a.activity.last_active).getTime() : 0;
    const lastActiveB = b.activity?.last_active ? new Date(b.activity.last_active).getTime() : 0;

    const diffA = Date.now() - lastActiveA;  // Durasi aktif
    const diffB = Date.now() - lastActiveB;  // Durasi aktif

    return diffB - diffA;  // Urutkan berdasarkan durasi aktif yang paling lama
  });

  // Urutkan pegawai yang tidak aktif berdasarkan durasi ketidakaktifan paling lama
  inactiveEmployees.sort((a, b) => {
    const lastActiveA = a.activity?.last_active ? new Date(a.activity.last_active).getTime() : 0;
    const lastActiveB = b.activity?.last_active ? new Date(b.activity.last_active).getTime() : 0;

    const diffA = Date.now() - lastActiveA;  // Durasi tidak aktif
    const diffB = Date.now() - lastActiveB;  // Durasi tidak aktif

    return diffB - diffA;  // Urutkan berdasarkan durasi tidak aktif yang paling lama
  });

  // Gabungkan pegawai yang aktif terlebih dahulu, diikuti dengan yang tidak aktif
  return [...activeEmployees, ...inactiveEmployees];
});

const longestEmployee = computed(() => sortedEmployee.value[0] || {});  // Pegawai pertama setelah diurutkan, atau null jika tidak ada data
const listEmployee = computed(() => sortedEmployee.value.slice(1));  // Pegawai lainnya setelah diurutkan, pastikan tidak kosong



// watcher untuk logging currentData
watch(currentData, () => {
  console.log('currentData', currentData.value)
})

watch(employeeData, () => {
  console.log('employeeData', employeeData.value)
})

watch(() => props.loading, () => {
  console.log('props.loading', props.loading)
})

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row class="mb-2">
          <v-col cols="12">
            <div class="d-flex align-center">
              <h4 class="text-h4">Kehadiran Pegawai</h4>
            </div>
            <div v-if="props.branch" class="text-subtitle-2 text-medium-emphasis">
              {{ props.branch?.name }} 
              <span 
                v-if="!props.loading && !currentData[0]?.branch.operational.activity.is_active" 
                class="text-disabled"
              >(Tutup)
              </span>
            </div> 
            <div v-else-if="!props.loading" class="text-subtitle-2 text-medium-emphasis">
              Semua Cabang
            </div>
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>
        <p v-if="!props.loading && (props.branch) && currentData[0]?.branch.operational.activity.is_active" class="text-subtitle-2 text-medium-emphasis text-right mt-4">
            Restoran telah buka selama
            <b class="text-h4">{{ getTimeDiff(currentData[0]?.branch.operational.activity.last_active!).slice(0, -5) }}</b>
        </p>

        <v-card class="bg-lightsecondary" v-if="!props.loading">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-success text-medium-emphasis">{{ longestEmployee?.activity?.is_active ? 'Aktif' : 'Tidak Aktif' }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ longestEmployee?.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ longestEmployee?.role }}</span>
              </div>
              <div v-if="!longestEmployee.activity?.is_active" class="text-right">
                <span class="text-subtitle-2 text-medium-emphasis">Terakhir Aktif</span>
                <h4 class="text-h4">{{ getTimeDiff(longestEmployee?.activity?.last_active)}}</h4>
              </div>
              <div v-else class="text-right">
                <h4 class="text-h4">{{ getTimeDiff(longestEmployee?.activity?.last_active).slice(0, -5)}}</h4>
              </div>
            </div>
          </div>
        </v-card>

        <div class="my-4" v-if="!props.loading">
          <ScrollContainer :style="{ maxHeight: mdAndUp? '10rem' : '18rem'}">
            <v-list lines="two" class="py-0" v-if="listEmployee.length > 0">
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
                      :class="[ 'text-subtitle-2 text-medium-emphasis', list.activity?.is_active ? 'text-success' : '' ]"
                    >
                      {{ list.activity?.is_active ? 'Aktif' : 'Tidak Aktif' }}
                    </span>
                    <h6
                      :class="[ 'text-h4 font-weight-bold', list.activity?.is_active ? 'text-primary text-medium-emphasis' : 'text-medium-emphasis' ]"
                    >
                      {{ list.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ list.role }}</span>
                  </div>
                  <div v-if="!list.activity?.is_active" class="text-right">
                    <span class="text-subtitle-2 text-medium-emphasis">Terakhir Aktif</span>
                    <h4 class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ getTimeDiff(list?.activity?.last_active)}}</h4>
                  </div>
                  <div v-else class="text-right">
                    <h4 class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ getTimeDiff(list?.activity?.last_active).slice(0, -5)}}</h4>
                  </div>
                </div>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-subtitle-2 text-disabled mt-4">
              Tidak ada data kehadiran
            </div>
          </ScrollContainer>

          <!-- <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/timesheets">
              Lihat Semua
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