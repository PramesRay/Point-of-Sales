<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { getTimeDiff } from "@/utils/helpers/time";

import type { Order, OrderItem } from '@/types/order';
import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

// import DetailOrder from '../../cashier/components/sub-components/DetailOrder.vue';
import { useMenuItems } from '@/composables/useMenuItems';

import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import type { Shift, ShiftCashier, ShiftKitchen, ShiftWarehouse } from '@/types/shift';
import { formatDate } from '@/utils/helpers/format-date';
import Blank from '@/components/shared/Blank.vue';
import DetailShiftCashier from './sub-components/shift/DetailShiftCashier.vue';
import type { Employee } from '@/types/employee';
import type { Branch } from '@/types/branch';
import DetailShiftKitchen from './sub-components/shift/DetailShiftKitchen.vue';
import DetailShiftWarehouse from './sub-components/shift/DetailShiftWarehouse.vue';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  shift_employee: Shift[];
  shift_cashier: ShiftCashier[];
  shift_kitchen: ShiftKitchen[];
  shift_warehouse: ShiftWarehouse[];
  
  data_employee: Employee[];
  data_branch: Branch[];

  branch: IdName | undefined | null;
  loading: boolean;
  
  refresh_employee: () => void;
  refresh_cashier: () => void;
  refresh_kitchen: () => void;
  refresh_warehouse: () => void;
  refresh_employees: () => void;
  refresh_branches: () => void;
}>();

const selectedEmployee = computed<Employee[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    console.log('props.data_employee', props.data_employee)
    return props.data_employee.filter((tx) => 
      (selectedTab.value === 3 ? tx.role === 'gudang' : ['kasir', 'dapur', 'gudang'].includes(tx.role!))
    );
  }
  return props.data_employee.filter((tx) => 
    (selectedTab.value === 3 ? tx.role === 'gudang' : ['kasir', 'dapur', 'gudang'].includes(tx.role!)) && 
    tx.assigned_branch.id === props.branch?.id
  );
})

const selectedBranch = computed<Branch[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.data_branch;
  }
  return props.data_branch.filter((tx) => tx.id === props.branch?.id);
})

const selectedShiftEmployee = computed<Shift[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_employee;
  }
  return props.shift_employee.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedShiftCashier = computed<ShiftCashier[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_cashier;
  }
  return props.shift_cashier.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedShiftKitchen = computed<ShiftKitchen[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_kitchen;
  }
  return props.shift_kitchen.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedWarehouse = computed<ShiftWarehouse[]>(() => {
  return props.shift_warehouse;
});

const latestEmployee = computed<Employee | null>(() => selectedEmployee.value[0] || null);
const listEmployee = computed<Employee[]>(() => selectedEmployee.value.slice(1) || []);

const latestBranch = computed<Branch | null>(() => selectedBranch.value[0] || null);
const listBranch = computed<Branch[]>(() => selectedBranch.value.slice(1) || []);

const latestShiftEmployee = computed<Shift | null>(() => selectedShiftEmployee.value[0] || null);
const listShiftEmployee = computed<Shift[]>(() => selectedShiftEmployee.value.slice(1) || []);

const latestShiftCashier = computed<ShiftCashier | null>(() => selectedShiftCashier.value[0] || null);
const listShiftCashier = computed<ShiftCashier[]>(() => selectedShiftCashier.value.slice(1) || []);

const latestShiftKitchen = computed<ShiftKitchen | null>(() => selectedShiftKitchen.value[0] || null);
const listShiftKitchen = computed<ShiftKitchen[]>(() => selectedShiftKitchen.value.slice(1) || []);

const latestShiftWarehouse = computed<ShiftWarehouse | null>(() => selectedWarehouse.value[0] || null);
const listShiftWarehouse = computed<ShiftWarehouse[]>(() => selectedWarehouse.value.slice(1) || []);

const byShift = ref(false);
const selectedTab = ref(0);
const tab = ref(['Pegawai', 'Kasir', 'Dapur', 'Gudang'])
const showArrows = computed(() => mdAndUp.value ? 'hover' : false);

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row align="center" no-gutters class="mb-4 ml-1">
          <v-col>
            <h4 class="text-h4">
              {{ byShift ? 'Semua' : '' }} Shift
              <v-btn
                icon
                variant="text"
                density="compact"
                size="small"
                @click="byShift = !byShift"
              >
                <v-icon>mdi-swap-vertical</v-icon>
              </v-btn>
            </h4>
            <span v-if="!props.loading" class="text-subtitle-2 text-medium-emphasis">{{ (props.branch && selectedTab !== 3) ? props.branch?.name : 'Semua Cabang' }}</span>
          </v-col>
          <v-col cols="auto" class="text-center" v-if="!props.loading">
            <v-window
              v-model="selectedTab"
              class="total-income-carousel"
              mandatory
              touch
              :show-arrows="showArrows"
            >
              <v-window-item
                v-for="(inc, index) in tab"
                :key="index"
                :value="index"
                eager
              >
                <v-card
                  elevation="0"
                  rounded="md"
                >
                  <v-card-text class="py-2">
                    <div class="d-flex align-center ga-4 justify-center">
                      <div>
                        <h4 class="text-h4 font-weight-medium">
                          {{ index === 0
                              ? 'Pegawai'
                              : index === 1
                              ? 'Kasir'
                              : index === 2
                              ? 'Dapur'
                              : 'Gudang' 
                          }}
                        </h4>
                      </div>
                      <v-btn
                        :color="
                          index === 0
                              ? 'secondary'
                              : index === 1
                              ? 'success'
                              : index === 2
                              ? 'warning'
                              : 'primary'
                        "
                        icon
                        size="small"
                        rounded="sm"
                        variant="flat"
                      >
                        <v-icon>
                          {{
                            index === 0
                              ? 'mdi-account'
                              : index === 1
                              ? 'mdi-cash-register'
                              : index === 2
                              ? 'mdi-stove'
                              : 'mdi-warehouse'
                          }}
                        </v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>

        <div v-if="!props.loading && selectedTab === 0">
          <div v-if="byShift">
            <v-card 
              class="bg-lightsecondary"
              :class="latestShiftEmployee?.end ? 'text-disabled' : 'text-medium-emphasis'"
            >
              <div v-if="latestShiftEmployee" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span 
                      v-if="latestShiftEmployee.start"
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestShiftEmployee.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestShiftEmployee.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestShiftEmployee.start!, !!latestShiftEmployee.end) }}
                      </span>
                    </span>
                    <span
                      v-else
                      class="text-subtitle-2 text-medium-emphasis"
                    >
                      Tidak Aktif
                    </span>
                    <h6 :class="(!latestShiftEmployee?.start || latestShiftEmployee?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                      {{ latestShiftEmployee?.meta.created_by.name }}
                    </h6>
                    <div :class="(!latestShiftEmployee?.start || latestShiftEmployee?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                      {{ latestShiftEmployee?.meta.created_by.role }} {{ latestShiftEmployee?.branch ? (' - ' + latestShiftEmployee?.branch.name) : '' }}
                    </div>
                    <!-- <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span> -->
                  </div>
                  <div v-if="!latestShiftEmployee?.end" class="text-right">
                    <div class="text-disabled">
                      Dimulai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestShiftEmployee?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestShiftEmployee?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-disabled text-right">
                      Selesai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestShiftEmployee?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestShiftEmployee?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listShiftEmployee?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listShiftEmployee" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    rounded="sm"
                    :class="item?.end ? 'text-disabled' : 'text-medium-emphasis'"
                  >
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <span 
                          v-if="item?.start"
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="item?.end ? 'text-success' : 'text-primary'"
                        >
                          {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                          <span class="font-weight-bold">
                            {{ getTimeDiff(item?.start!, !!item?.end) }}
                          </span>
                        </span>
                        <span
                          v-else
                          class="text-subtitle-2 text-medium-emphasis"
                        >
                          Tidak Aktif
                        </span>
                        <h6 :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                          {{ item?.meta.created_by.name }}
                        </h6>
                        <div :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                          {{ item?.meta.created_by.role }} {{ item?.branch ? (' - ' + item?.branch.name) : '' }}
                        </div>
                        <!-- <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span> -->
                      </div>
                      <div v-if="!item?.end" class="text-subtitle-2 text-right">
                        <div class="text-disabled">
                          Dimulai pada: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-right">
                        <div class="text-disabled">
                          Selesai pada: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestShiftEmployee && listShiftEmployee?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Shift Pegawai Kosong
              </div>
            </div>

          </div>
          <div v-else>
            <v-card class="bg-lightsecondary"
            >
              <div v-if="latestEmployee?.activity.shift_emp" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestEmployee?.activity.shift_emp?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestEmployee?.activity.shift_emp?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestEmployee?.activity.shift_emp?.start, !!latestEmployee?.activity.shift_emp?.end) }}</span>
                      </span>
                    <h6 :class="!latestEmployee?.activity.shift_emp?.start || latestEmployee?.activity.shift_emp?.end ? '' : 'text-secondary'" class="text-secondary text-h4 font-weight-bold">
                      {{ latestEmployee?.activity.shift_emp?.meta.created_by.name }}
                    </h6>
                    <div :class="!latestEmployee?.activity.shift_emp?.start || latestEmployee?.activity.shift_emp?.end ? '' : 'text-secondary'" class="text-secondary text-subtitle-2 text-medium-emphasis">
                      {{ latestEmployee?.activity.shift_emp?.meta.created_by.role }} {{ latestEmployee?.activity.shift_emp?.branch ? (' - ' + latestEmployee?.activity.shift_emp?.branch.name) : '' }}
                    </div>
                    <!-- <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span> -->
                  </div>
                  <div v-if="!latestEmployee?.activity.shift_emp?.end" class="text-right">
                    <div class="text-disabled">
                      Dimulai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestEmployee.activity.shift_emp?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestEmployee.activity.shift_emp?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                  <div v-else class="text-right">
                    <div class="text-disabled">
                      Selesai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestEmployee.activity.shift_emp?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestEmployee.activity.shift_emp?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listEmployee?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listEmployee" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    rounded="sm"
                    :class="(!item?.activity.shift_emp?.start || item?.activity.shift_emp?.end) ? 'text-disabled' : 'text-medium-emphasis'"
                  >
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <span 
                          v-if="item?.activity.shift_emp?.start"
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="item?.activity.shift_emp?.end ? 'text-success' : 'text-primary'"
                        >
                          {{ item?.activity.shift_emp?.end ? 'Selesai: ' : 'Aktif: ' }} 
                          <span class="font-weight-bold">
                            {{ getTimeDiff(item?.activity.shift_emp?.start!, !!item?.activity.shift_emp?.end) }}
                          </span>
                        </span>
                        <span
                          v-else
                          class="text-subtitle-2 text-medium-emphasis"
                        >
                          Tidak Aktif
                        </span>
                        <h6 :class="(!item?.activity.shift_emp?.start || item?.activity.shift_emp?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                          {{ item?.name }}
                        </h6>
                        <div :class="(!item?.activity.shift_emp?.start || item?.activity.shift_emp?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                          {{ item?.role }} {{ item?.activity.shift_emp?.branch ? (' - ' + item?.activity.shift_emp.branch.name) : '' }}
                        </div>
                        <!-- <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span> -->
                      </div>
                      <div v-if="item?.activity.shift_emp?.start">
                        <div v-if="!item?.activity.shift_emp?.end" class="text-subtitle-2 text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity.shift_emp?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity.shift_emp?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity.shift_emp?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity.shift_emp?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-right text-disabled">
                        <div>
                          Terakhir aktif: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.activity.last_active).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.activity.last_active).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestEmployee && listEmployee?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Pegawai Kosong
              </div>
            </div>
          </div>
        </div>
        <div v-if="!props.loading && selectedTab === 1">
          <div v-if="!byShift">
            <v-card class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftCashier,
                  props: {
                    data: latestBranch?.operational.activity.shift_cashier
                  }
                })
              "
            >
              <div v-if="latestBranch?.operational.activity.shift_cashier" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div :class="(!latestBranch?.operational.activity.shift_cashier?.start || latestBranch?.operational.activity.shift_cashier?.end) ? 'text-disabled' : 'text-secondary'">
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestBranch?.operational.activity.shift_cashier?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestBranch?.operational.activity.shift_cashier?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestBranch?.operational.activity.shift_cashier?.start!, !!latestBranch?.operational.activity.shift_cashier?.end) }} 
                      </span>
                    </span>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestBranch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestBranch?.operational.activity.shift_cashier?.meta.created_by.name }}</span>
                    </div>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <div v-if="!latestBranch?.operational.activity.shift_cashier?.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestBranch?.operational.activity.shift_cashier?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestBranch?.operational.activity.shift_cashier?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestBranch?.operational.activity.shift_cashier?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestBranch?.operational.activity.shift_cashier?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listBranch?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listBranch" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    :class="item.operational.activity.shift_cashier.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                    @click="
                      openOverlay({
                        component: DetailShiftCashier,
                        props: {
                          data: item.operational.activity.shift_cashier
                        }
                      })
                    "
                  >
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="item.operational.activity.shift_cashier.end ? 'text-success' : 'text-primary'"
                    >
                      {{ item.operational.activity.shift_cashier.end ? 'Selesai: ' : 'Aktif: ' }}
                      <span class="font-weight-bold">
                        {{ getTimeDiff(item.operational.activity.shift_cashier.start!, !!item.operational.activity.shift_cashier.end) }} 
                      </span>
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <div :class="(!item.operational.activity.shift_cashier.start || item.operational.activity.shift_cashier.end) ? 'text-disabled' : 'text-secondary'">
                          <h6 class="text-h4 font-weight-bold">
                            {{ item.name }}
                          </h6>
                          <div class="text-subtitle-2 text-disabled">
                            Dimulai oleh: <span class="font-weight-bold">{{ item.operational.activity.shift_cashier.meta.created_by.name }}</span>
                          </div>
                          <span class="text-subtitle-2 text-disabled">
                            Lihat Detail
                          </span>
                        </div>
                      </div>
                      <div>
                        <div v-if="!item.operational.activity.shift_cashier.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.operational.activity.shift_cashier.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.operational.activity.shift_cashier.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.operational.activity.shift_cashier.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.operational.activity.shift_cashier.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestBranch && listBranch?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Cabang Kosong
              </div>
            </div>
          </div>
          <div v-else>
            <v-card class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftCashier,
                  props: {
                    data: latestShiftCashier
                  }
                })
              "
            >
              <div v-if="latestShiftCashier" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div :class="(!latestShiftCashier?.start || latestShiftCashier?.end) ? 'text-disabled' : 'text-secondary'">
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestShiftCashier?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestShiftCashier?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestShiftCashier?.start!, !!latestShiftCashier?.end) }} 
                      </span>
                    </span>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestShiftCashier?.branch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestShiftCashier?.meta.created_by.name }}</span>
                    </div>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <div v-if="!latestShiftCashier?.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestShiftCashier?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestShiftCashier?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestShiftCashier?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestShiftCashier?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listShiftCashier?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listShiftCashier" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    :class="item.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                    @click="
                      openOverlay({
                        component: DetailShiftCashier,
                        props: {
                          data: item
                        }
                      })
                    "
                  >
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="item.end ? 'text-success' : 'text-primary'"
                    >
                      {{ item.end ? 'Selesai: ' : 'Aktif: ' }}
                      <span class="font-weight-bold">
                        {{ getTimeDiff(item.start!, !!item.end) }} 
                      </span>
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <div :class="(!item.start || item.end) ? 'text-disabled' : 'text-secondary'">
                          <h6 class="text-h4 font-weight-bold">
                            {{ item.branch?.name }}
                          </h6>
                          <div class="text-subtitle-2 text-disabled">
                            Dimulai oleh: <span class="font-weight-bold">{{ item.meta.created_by.name }}</span>
                          </div>
                          <span class="text-subtitle-2 text-disabled">
                            Lihat Detail
                          </span>
                        </div>
                      </div>
                      <div>
                        <div v-if="!item.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestShiftCashier && listShiftCashier?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Shift Kasir Kosong
              </div>
            </div>
          </div>
        </div>
        <div v-if="!props.loading && selectedTab === 2">
          <div v-if="!byShift">
            <v-card class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftKitchen,
                  props: {
                    data: latestBranch?.operational.activity.shift_kitchen
                  }
                })
              "
            >
              <div v-if="latestBranch?.operational.activity.shift_kitchen" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div :class="(!latestBranch?.operational.activity.shift_kitchen?.start || latestBranch?.operational.activity.shift_kitchen?.end) ? 'text-disabled' : 'text-secondary'">
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestBranch?.operational.activity.shift_kitchen?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestBranch?.operational.activity.shift_kitchen?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestBranch?.operational.activity.shift_kitchen?.start!, !!latestBranch?.operational.activity.shift_kitchen?.end) }} 
                      </span>
                    </span>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestBranch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestBranch?.operational.activity.shift_kitchen?.meta.created_by.name }}</span>
                    </div>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <div v-if="!latestBranch?.operational.activity.shift_kitchen?.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestBranch?.operational.activity.shift_kitchen?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestBranch?.operational.activity.shift_kitchen?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestBranch?.operational.activity.shift_kitchen?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestBranch?.operational.activity.shift_kitchen?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listBranch?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listBranch" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    :class="item.operational.activity.shift_kitchen.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                    @click="
                      openOverlay({
                        component: DetailShiftKitchen,
                        props: {
                          data: item
                        }
                      })
                    "
                  >
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="item.operational.activity.shift_kitchen.end ? 'text-success' : 'text-primary'"
                    >
                      {{ item.operational.activity.shift_kitchen.end ? 'Selesai: ' : 'Aktif: ' }}
                      <span class="font-weight-bold">
                        {{ getTimeDiff(item.operational.activity.shift_kitchen.start!, !!item.operational.activity.shift_kitchen.end) }} 
                      </span>
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <div :class="(!item.operational.activity.shift_kitchen.start || item.operational.activity.shift_kitchen.end) ? 'text-disabled' : 'text-secondary'">
                          <h6 class="text-h4 font-weight-bold">
                            {{ item.name }}
                          </h6>
                          <div class="text-subtitle-2 text-disabled">
                            Dimulai oleh: <span class="font-weight-bold">{{ item.operational.activity.shift_kitchen.meta.created_by.name }}</span>
                          </div>
                          <span class="text-subtitle-2 text-disabled">
                            Lihat Detail
                          </span>
                        </div>
                      </div>
                      <div>
                        <div v-if="!item.operational.activity.shift_kitchen.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.operational.activity.shift_kitchen.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.operational.activity.shift_kitchen.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.operational.activity.shift_kitchen.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.operational.activity.shift_kitchen.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestBranch && listBranch?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Cabang Kosong
              </div>
            </div>
          </div>
          <div v-else>
            <v-card class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftCashier,
                  props: {
                    data: latestShiftKitchen
                  }
                })
              "
            >
              <div v-if="latestShiftKitchen" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div :class="(!latestShiftKitchen?.start || latestShiftKitchen?.end) ? 'text-disabled' : 'text-secondary'">
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestShiftKitchen?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestShiftKitchen?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestShiftKitchen?.start!, !!latestShiftKitchen?.end) }} 
                      </span>
                    </span>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestShiftKitchen?.branch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestShiftKitchen?.meta.created_by.name }}</span>
                    </div>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <div v-if="!latestShiftKitchen?.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestShiftKitchen?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestShiftKitchen?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(latestShiftKitchen?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(latestShiftKitchen?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listShiftKitchen?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listShiftKitchen" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    :class="item.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                    @click="
                      openOverlay({
                        component: DetailShiftCashier,
                        props: {
                          data: item
                        }
                      })
                    "
                  >
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="item.end ? 'text-success' : 'text-primary'"
                    >
                      {{ item.end ? 'Selesai: ' : 'Aktif: ' }}
                      <span class="font-weight-bold">
                        {{ getTimeDiff(item.start!, !!item.end) }} 
                      </span>
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <div :class="(!item.start || item.end) ? 'text-disabled' : 'text-secondary'">
                          <h6 class="text-h4 font-weight-bold">
                            {{ item.branch?.name }}
                          </h6>
                          <div class="text-subtitle-2 text-disabled">
                            Dimulai oleh: <span class="font-weight-bold">{{ item.meta.created_by.name }}</span>
                          </div>
                          <span class="text-subtitle-2 text-disabled">
                            Lihat Detail
                          </span>
                        </div>
                      </div>
                      <div>
                        <div v-if="!item.end" class="text-subtitle-2 text-medium-emphasis text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="font-weight-bold">  
                            {{ formatDate(item.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestShiftKitchen && listShiftKitchen?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Shift Dapur Kosong
              </div>
            </div>
          </div>
        </div>
        <div v-if="!props.loading && selectedTab === 3">
          <div v-if="byShift">
            <v-card 
              class="bg-lightsecondary"
              :class="latestShiftWarehouse?.end ? 'text-disabled' : 'text-medium-emphasis'"
              @click="
                openOverlay({
                  component: DetailShiftWarehouse,
                  props: {
                    data: latestShiftWarehouse!
                  }
                })
              "
            >
              <div v-if="latestShiftWarehouse" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span 
                      v-if="latestShiftWarehouse.start"
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestShiftWarehouse.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestShiftWarehouse.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestShiftWarehouse.start!, !!latestShiftWarehouse.end) }}
                      </span>
                    </span>
                    <span
                      v-else
                      class="text-subtitle-2 text-medium-emphasis"
                    >
                      Tidak Aktif
                    </span>
                    <h6 :class="(!latestShiftWarehouse?.start || latestShiftWarehouse?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                      {{ latestShiftWarehouse?.meta.created_by.name }}
                    </h6>
                    <div :class="(!latestShiftWarehouse?.start || latestShiftWarehouse?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                      {{ latestShiftWarehouse?.meta.created_by.role }}
                    </div>
                    <!-- <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span> -->
                  </div>
                  <div v-if="!latestShiftWarehouse?.end" class="text-right">
                    <div class="text-disabled">
                      Dimulai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestShiftWarehouse?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestShiftWarehouse?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                  <div v-else class="text-right">
                    <div class="text-disabled">
                      Selesai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestShiftWarehouse?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestShiftWarehouse?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listShiftWarehouse?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listShiftWarehouse" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    rounded="sm"
                    :class="item?.end ? 'text-disabled' : 'text-medium-emphasis'"
                    @click="
                      openOverlay({
                        component: DetailShiftWarehouse,
                        props: {
                          data: item
                        }
                      })
                    "
                  >
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <span 
                          v-if="item?.start"
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="item?.end ? 'text-success' : 'text-primary'"
                        >
                          {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                          <span class="font-weight-bold">
                            {{ getTimeDiff(item?.start!, !!item?.end) }}
                          </span>
                        </span>
                        <span
                          v-else
                          class="text-subtitle-2 text-medium-emphasis"
                        >
                          Tidak Aktif
                        </span>
                        <h6 :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                          {{ item?.meta.created_by.name }}
                        </h6>
                        <div :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                          {{ item?.meta.created_by.role }}
                        </div>
                        <!-- <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span> -->
                      </div>
                      <div v-if="!item?.end" class="text-subtitle-2 text-right">
                        <div class="text-disabled">
                          Dimulai pada: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-right">
                        <div class="text-disabled">
                          Selesai pada: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestShiftWarehouse && listShiftWarehouse?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Shift Gudang Kosong
              </div>
            </div>

          </div>
          <div v-else>
            <v-card class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftWarehouse,
                  props: {
                    data: latestEmployee?.activity.shift_op!
                  }
                })
              "
            >
              <div v-if="latestEmployee?.activity.shift_op" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestEmployee?.activity.shift_op?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestEmployee?.activity.shift_op?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestEmployee?.activity.shift_op?.start, !!latestEmployee?.activity.shift_op?.end) }}</span>
                      </span>
                    <h6 :class="!latestEmployee?.activity.shift_op?.start || latestEmployee?.activity.shift_op?.end ? '' : 'text-secondary'" class="text-secondary text-h4 font-weight-bold">
                      {{ latestEmployee?.activity.shift_op?.meta.created_by.name }}
                    </h6>
                    <div :class="!latestEmployee?.activity.shift_op?.start || latestEmployee?.activity.shift_op?.end ? '' : 'text-secondary'" class="text-secondary text-subtitle-2 text-medium-emphasis">
                      {{ latestEmployee?.role }}
                    </div>
                    <!-- <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span> -->
                  </div>
                  <div v-if="!latestEmployee?.activity.shift_op?.end" class="text-right">
                    <div class="text-disabled">
                      Dimulai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestEmployee.activity.shift_op?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestEmployee.activity.shift_op?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                  <div v-else class="text-right">
                    <div class="text-disabled">
                      Selesai pada: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestEmployee.activity.shift_op?.start).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestEmployee.activity.shift_op?.start).split(' pukul')[1] }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4" >
              <ScrollContainer :style="{ maxHeight: mdAndUp? '33rem' : '18rem'}">
                <v-list v-if="listEmployee?.length > 0" class="py-0">
                  <v-list-item 
                    v-for="(item, i) in listEmployee" 
                    :key="i" 
                    :value="item"
                    color="secondary"
                    rounded="sm"
                    :disabled="!item?.activity.shift_op?.start"
                    :class="(!item?.activity.shift_op?.start || item?.activity.shift_op?.end) ? 'text-disabled' : 'text-medium-emphasis'"
                    @click="
                      openOverlay({
                        component: DetailShiftWarehouse,
                        props: {
                          data: item.activity.shift_op!
                        }
                      })
                    "
                  >
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <span 
                          v-if="item?.activity.shift_op?.start"
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="item?.activity.shift_op?.end ? 'text-success' : 'text-primary'"
                        >
                          {{ item?.activity.shift_op?.end ? 'Selesai: ' : 'Aktif: ' }} 
                          <span class="font-weight-bold">
                            {{ getTimeDiff(item?.activity.shift_op?.start!, !!item?.activity.shift_op?.end) }}
                          </span>
                        </span>
                        <span
                          v-else
                          class="text-subtitle-2 text-medium-emphasis"
                        >
                          Tidak Aktif
                        </span>
                        <h6 :class="(!item?.activity.shift_op?.start || item?.activity.shift_op?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                          {{ item?.name }}
                        </h6>
                        <div :class="(!item?.activity.shift_op?.start || item?.activity.shift_op?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                          {{ item?.role }}
                        </div>
                        <!-- <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span> -->
                      </div>
                      <div v-if="item?.activity.shift_op?.start">
                        <div v-if="!item?.activity.shift_op?.end" class="text-subtitle-2 text-right">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity.shift_op?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity.shift_op?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity.shift_op?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity.shift_op?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-right text-disabled">
                        <div>
                          Terakhir aktif: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.activity.last_active).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.activity.last_active).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </ScrollContainer>
              <!-- jika data kosong -->
              <div 
                v-if="!latestEmployee && listEmployee?.length === 0" 
                class="text-center text-subtitle-2 text-disabled mt-4"
              >
                Data Pegawai Kosong
              </div>
            </div>
          </div>
        </div>
        <div v-if="props.loading" class="ml-auto">
          <!-- Skeleton Loading -->
          <v-skeleton-loader
            type="list-item-two-line"
            :loading="props.loading"
          ></v-skeleton-loader>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss">
.v-card-text {
  padding: 20px;
}

.carousel-container {
  position: relative;

  .total-income-carousel {
    justify-items: center;
  }

  .slide-indicator-bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }
}

.bar {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: #c4c4c4;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar.active {
  width: 32px;
  background-color: #ffffff;
}
</style>