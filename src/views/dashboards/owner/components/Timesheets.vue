<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency'

const select = ref<{ state: 'Restoran 1' | 'Restoran 2' | 'Restoran 3' | 'Restoran 4'}>({ state: 'Restoran 1' });

const items = [
  { state: 'Restoran 1' },
  { state: 'Restoran 2' },
  { state: 'Restoran 3' },
  { state: 'Restoran 4' }
];

// Data Chart berdasarkan pilihan
const dataRestoran = ref({
  "Restoran 1": {
    open_hour: 5,
    employee: [
      { name: 'Aldi', role: 'Manajer', active_hour: 5, status: 'aktif' },
      { name: 'Rina', role: 'Supervisor', active_hour: 5, status: 'aktif' },
      { name: 'Budi', role: 'Pelayan', active_hour: 5, status: 'aktif' },
      { name: 'Siti', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Joko', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "Restoran 2": {
    open_hour: 6,
    employee: [
      { name: 'Dian', role: 'Manajer', active_hour: 6, status: 'aktif' },
      { name: 'Fajar', role: 'Supervisor', active_hour: 6, status: 'aktif' },
      { name: 'Tono', role: 'Pelayan', active_hour: 6, status: 'aktif' },
      { name: 'Ayu', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Bagas', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "Restoran 3": {
    open_hour: 4,
    employee: [
      { name: 'Lina', role: 'Manajer', active_hour: 4, status: 'aktif' },
      { name: 'Rizky', role: 'Supervisor', active_hour: 4, status: 'aktif' },
      { name: 'Anton', role: 'Pelayan', active_hour: 4, status: 'aktif' },
      { name: 'Sari', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Hadi', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  },
  "Restoran 4": {
    open_hour: 7,
    employee: [
      { name: 'Yuni', role: 'Manajer', active_hour: 7, status: 'aktif' },
      { name: 'Gilang', role: 'Supervisor', active_hour: 7, status: 'aktif' },
      { name: 'Nita', role: 'Pelayan', active_hour: 7, status: 'aktif' },
      { name: 'Eko', role: 'Kasir', active_hour: 0, status: 'offline' },
      { name: 'Bambang', role: 'Koki', active_hour: 0, status: 'offline' }
    ]
  }
});

const currentData = computed(() => {
  if (!select.value || !select.value.state || !dataRestoran.value[select.value.state]) {
    return { open_hour: 0, employee: [] }; // Default structure
  }
  return dataRestoran.value[select.value.state];
});

const longestEmployee = computed(() => {
  return currentData.value.employee.length > 0 ? currentData.value.employee[0] : null;
});

const listEmployee = computed(() => {
  return currentData.value.employee.slice(1);
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9">
            <h4 class="text-h4 mt-1">Kehadiran Pegawai</h4>
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
        <p class="text-subtitle-2 text-medium-emphasis mt-2 text-right">
          Restoran telah buka selama
          <b class="text-h4">{{ currentData?.open_hour }} Jam</b>
        </p>
        <v-card class="bg-lightsecondary mt-5">
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
        <div class="mt-4">
          <perfect-scrollbar v-bind:style="{ height: '270px' }">
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(listEmployee, i) in listEmployee" :key="i" :value="listEmployee" color="secondary" rounded="sm">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span v-if="listEmployee.status === 'aktif'" class="text-subtitle-2 text-success text-medium-emphasis">{{ listEmployee.status }}</span>
                    <span v-else class="text-subtitle-2 text-medium-emphasis">{{ listEmployee.status }}</span>
                    <h6 v-if="listEmployee.status === 'aktif'" class="text-h4 text-primary text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                      {{ listEmployee.name }}
                    </h6>
                    <h6 v-else class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ listEmployee.name }}</h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ listEmployee.role }}</span>
                  </div>
                  <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ listEmployee.active_hour + ' Jam' }}</div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/timesheets"
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