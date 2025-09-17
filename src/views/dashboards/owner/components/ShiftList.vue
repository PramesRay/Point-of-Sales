<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { getTimeDiff } from "@/utils/helpers/time";

import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import type { ShiftCashier, ShiftEmployee, ShiftKitchen, ShiftWarehouse } from '@/types/shift';
import { formatDate } from '@/utils/helpers/format-date';
import Blank from '@/components/shared/Blank.vue';
import DetailShiftCashier from './sub-components/shift/DetailShiftCashier.vue';
import type { Employee } from '@/types/employee';
import type { Branch } from '@/types/branch';
import DetailShiftKitchen from './sub-components/shift/DetailShiftKitchen.vue';
import DetailShiftWarehouse from './sub-components/shift/DetailShiftWarehouse.vue';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  shift_employee: ShiftEmployee[];
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
  const sortedEmployee = [...props.data_employee].filter(tx => tx.role !== null).sort((a, b) => {
    const hasShiftEmpA = !!a.activity?.shift_emp;
    const hasShiftEmpB = !!b.activity?.shift_emp;
    if (hasShiftEmpA !== hasShiftEmpB) return hasShiftEmpA ? -1 : 1; // yang punya shift_emp duluan

    const isActiveA = !!a.activity?.is_active;
    const isActiveB = !!b.activity?.is_active;
    if (isActiveA !== isActiveB) return isActiveA ? -1 : 1; // aktif (true) di atas non-aktif

    const lastA = a.activity?.last_active ? new Date(a.activity.last_active).getTime() : -Infinity;
    const lastB = b.activity?.last_active ? new Date(b.activity.last_active).getTime() : -Infinity;
    return lastB - lastA; // yang paling baru di atas
    });


  if (!props.branch || props.branch.id === 'all') {
    return sortedEmployee;
  }
  return sortedEmployee.filter((tx) => 
    tx.assigned_branch ? tx.assigned_branch.id === props.branch?.id : false
  ).concat(
    props.data_employee.filter(tx => 
      !sortedEmployee.some(val => val.id === tx.id) && 
      tx.assigned_branch ? tx.assigned_branch.id === props.branch?.id : false
    )
  );
})

const selectedBranch = computed<Branch[]>(() => {
  const sortedBranch = props.data_branch.sort((a: Branch, b: Branch) => {
    const lastActiveA = a.operational?.activity.last_active ? new Date(a.operational?.activity.last_active).getTime() : 0;
    const lastActiveB = b.operational?.activity.last_active ? new Date(b.operational?.activity.last_active).getTime() : 0;

    const startA = selectedTab.value === 1 
      ? a.operational?.activity?.shift_cashier?.start 
        ? new Date(a.operational?.activity?.shift_cashier?.start).getTime() 
        : 0
      : selectedTab.value === 2 
        ? a.operational?.activity?.shift_kitchen?.start 
          ? new Date(a.operational?.activity?.shift_kitchen?.start).getTime() 
          : 0
        : 0;
    
    const startB = selectedTab.value === 1 
      ? b.operational?.activity?.shift_cashier?.start 
        ? new Date(b.operational?.activity?.shift_cashier?.start).getTime() 
        : 0
      : selectedTab.value === 2 
        ? b.operational?.activity?.shift_kitchen?.start 
          ? new Date(b.operational?.activity?.shift_kitchen?.start).getTime() 
          : 0
        : 0;

    return startB - startA || lastActiveA - lastActiveB;
  });

  if (!props.branch || props.branch.id === 'all') {
    return sortedBranch;
  }
  return sortedBranch.filter((tx) => tx.id === props.branch?.id);
})

const selectedShiftEmployee = computed<ShiftEmployee[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_employee;
  }
  return props.shift_employee.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedShiftCashier = computed<ShiftCashier[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_cashier;
  }
  return props.shift_cashier?.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedShiftKitchen = computed<ShiftKitchen[]>(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.shift_kitchen;
  }
  return props.shift_kitchen?.filter((tx) => tx.branch ? tx.branch.id === props.branch?.id : false);
});

const selectedWarehouse = computed<ShiftWarehouse[]>(() => {
  return props.shift_warehouse;
});

const latestEmployee = computed<Employee | null>(() => selectedEmployee.value[0] || null);
const listEmployee = computed<Employee[]>(() => selectedEmployee.value.slice(1) || []);

const latestBranch = computed<Branch | null>(() => selectedBranch.value[0] || null);
const listBranch = computed<Branch[]>(() => selectedBranch.value.slice(1) || []);

const latestShiftEmployee = computed<ShiftEmployee | null>(() => selectedShiftEmployee.value[0] || null);
const listShiftEmployee = computed<ShiftEmployee[]>(() => selectedShiftEmployee.value.slice(1) || []);

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
              {{ (byShift || selectedTab === 3) ? 'Semua' : '' }} Shift
              <v-btn
                v-if="selectedTab !== 3"
                icon
                variant="text"
                density="compact"
                size="small"
                @click="byShift = !byShift"
              >
                <v-icon>mdi-swap-vertical</v-icon>
              </v-btn>
            </h4>
            <div v-if="!props.loading" class="text-subtitle-2 text-medium-emphasis">
              <div v-if="!byShift && selectedTab !== 3">
                {{ selectedTab !== 0 
                    ? !!props.branch ? `Dari Cabang ${props.branch?.name}` : ' Dari Semua Cabang'
                    : 'Dari Pegawai' 
                }}
              </div>
              <div v-if="byShift && selectedTab !== 3">{{ (props.branch && selectedTab !== 3) ? `Di ${props.branch?.name}` : 'Di Semua Cabang' }}</div>
            </div>
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
              v-if="latestShiftEmployee"
              class="bg-lightsecondary pa-5"
              :class="latestShiftEmployee?.end ? 'text-disabled' : 'text-medium-emphasis'"
            >
              <div v-if="latestShiftEmployee" class="text-subtitle-2 text-medium-emphasis">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="d-flex align-center justify-space-between">
                    <div>
                      <span 
                        v-if="latestShiftEmployee.start"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestShiftEmployee.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestShiftEmployee.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestShiftEmployee.end ?? latestShiftEmployee.start, !!latestShiftEmployee.end) }}
                        </span>
                      </span>
                      <span
                        v-else
                        class="text-subtitle-2 text-medium-emphasis"
                      >
                        Tidak Aktif
                      </span>
                      <h6 :class="(!latestShiftEmployee?.start || latestShiftEmployee?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                        {{ latestShiftEmployee?.meta?.created_by?.name }}
                      </h6>
                      <div :class="(!latestShiftEmployee?.start || latestShiftEmployee?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                        {{ latestShiftEmployee?.employee?.role + ' - ' }} {{ latestShiftEmployee?.branch ? (latestShiftEmployee?.branch.name) : '' }}
                      </div>
                    </div>
                  </v-col>
                  <v-col class="text-subtitle-2 text-right">
                    <div v-if="!latestShiftEmployee?.end">
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
                      <div class="text-disabled">
                        Selesai pada: 
                      </div>
                      <div class="text-subtitle-2 font-weight-bold">  
                        {{ formatDate(latestShiftEmployee?.end).split(' pukul')[0] }}
                      </div>
                      <div class="text-h4">
                        {{ formatDate(latestShiftEmployee?.end).split(' pukul')[1] }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
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
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <v-row no-gutters>
                      <v-col class="d-flex align-center justify-space-between">
                        <div>
                          <span 
                            v-if="item?.start"
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="item?.end ? 'text-success' : 'text-primary'"
                          >
                            {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                            <span class="font-weight-bold">
                              {{ getTimeDiff(item?.end ?? item?.start, !!item?.end) }}
                            </span>
                          </span>
                          <span
                            v-else
                            class="text-subtitle-2 text-medium-emphasis"
                          >
                            Tidak Aktif
                          </span>
                          <h6 :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                            {{ item?.meta?.created_by?.name }}
                          </h6>
                          <div :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                            {{ item?.employee?.role + ' - ' }} {{ item?.branch ? (item?.branch.name) : '' }}
                          </div>
                        </div>
                      </v-col>
                      <v-col class="text-subtitle-2 text-right">
                        <div v-if="!item?.end">
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
                        <div v-else>
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.end).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.end).split(' pukul')[1] }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
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
            <v-card class="bg-lightsecondary" v-if="latestEmployee">
              <div class="pa-5 text-subtitle-2 text-medium-emphasis">
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span 
                      v-if="latestEmployee?.activity?.is_active"
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="latestEmployee?.activity?.shift_emp?.end ? 'text-success' : 'text-primary'"
                    >
                      {{ latestEmployee?.activity?.shift_emp?.end ? 'Selesai: ' : 'Aktif: ' }} 
                      <span class="font-weight-bold">
                        {{ getTimeDiff(latestEmployee?.activity?.shift_emp?.end ?? latestEmployee?.activity?.shift_emp?.start, !!latestEmployee?.activity?.shift_emp?.end) }}
                      </span>
                    </span>
                    <span
                      v-else
                      class="text-subtitle-2 text-medium-emphasis"
                    >
                      Tidak Aktif
                    </span>
                    <h6 :class="(!latestEmployee?.activity?.shift_emp?.start || latestEmployee?.activity?.shift_emp?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                      {{ latestEmployee?.name }}
                    </h6>
                    <div :class="(!latestEmployee?.activity?.shift_emp?.start || latestEmployee?.activity?.shift_emp?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                      {{ latestEmployee?.role + ' - ' }} {{ latestEmployee?.assigned_branch ? (latestEmployee.assigned_branch.name) : '' }}
                    </div>
                    <!-- <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span> -->
                  </div>
                  <div v-if="!latestEmployee?.activity?.shift_emp">
                    <div class="text-subtitle-2 text-right text-disabled">
                      Belum ada shift
                    </div>
                  </div>
                  <div v-else-if="latestEmployee?.activity?.shift_emp" class="text-subtitle-2 text-right">
                    <div v-if="!latestEmployee?.activity?.shift_emp?.end">
                      <div class="text-disabled">
                        Dimulai pada: 
                      </div>
                      <div class="text-subtitle-2 font-weight-bold">  
                        {{ formatDate(latestEmployee?.activity?.shift_emp?.start).split(' pukul')[0] }}
                      </div>
                      <div class="text-h4">
                        {{ formatDate(latestEmployee?.activity?.shift_emp?.start).split(' pukul')[1] }}
                      </div>
                    </div>
                    <div v-else class="text-subtitle-2 text-right">
                      <div class="text-disabled">
                        Selesai pada: 
                      </div>
                      <div class="text-subtitle-2 font-weight-bold">  
                        {{ formatDate(latestEmployee?.activity?.shift_emp?.end).split(' pukul')[0] }}
                      </div>
                      <div class="text-h4">
                        {{ formatDate(latestEmployee?.activity?.shift_emp?.end).split(' pukul')[1] }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-subtitle-2 text-right text-disabled">
                    <div>
                      Terakhir aktif: 
                    </div>
                    <div class="text-subtitle-2 font-weight-bold">  
                      {{ formatDate(latestEmployee?.activity?.last_active).split(' pukul')[0] }}
                    </div>
                    <div class="text-h4">
                      {{ formatDate(latestEmployee?.activity?.last_active).split(' pukul')[1] }}
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
                    :class="(!item?.activity?.shift_emp?.start || item?.activity?.shift_emp?.end) ? 'text-disabled' : 'text-medium-emphasis'"
                  >
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <span 
                          v-if="item?.activity?.is_active"
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="item?.activity?.shift_emp?.end ? 'text-success' : 'text-primary'"
                        >
                          {{ item?.activity?.shift_emp?.end ? 'Selesai: ' : 'Aktif: ' }} 
                          <span class="font-weight-bold">
                            {{ getTimeDiff(item?.activity?.shift_emp?.end ?? item?.activity?.shift_emp?.start, !!item?.activity?.shift_emp?.end) }}
                          </span>
                        </span>
                        <span
                          v-else
                          class="text-subtitle-2 text-medium-emphasis"
                        >
                          Tidak Aktif
                        </span>
                        <h6 :class="(!item?.activity?.shift_emp?.start || item?.activity?.shift_emp?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                          {{ item?.name }}
                        </h6>
                        <div :class="(!item?.activity?.shift_emp?.start || item?.activity?.shift_emp?.end) ? '' : 'text-secondary'" class="text-subtitle-2 text-medium-emphasis">
                          {{ item?.role + ' - ' }} {{ item?.assigned_branch ? (item?.assigned_branch.name) : '' }}
                        </div>
                        <!-- <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span> -->
                      </div>
                      <div v-if="!item?.activity?.shift_emp">
                        <div class="text-subtitle-2 text-right text-disabled">
                          Belum ada shift
                        </div>
                      </div>
                      <div v-else-if="item?.activity?.shift_emp" class="text-subtitle-2 text-right">
                        <div v-if="!item?.activity?.shift_emp?.end">
                          <div class="text-disabled">
                            Dimulai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity?.shift_emp?.start).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity?.shift_emp?.start).split(' pukul')[1] }}
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-right">
                          <div class="text-disabled">
                            Selesai pada: 
                          </div>
                          <div class="text-subtitle-2 font-weight-bold">  
                            {{ formatDate(item?.activity?.shift_emp?.end).split(' pukul')[0] }}
                          </div>
                          <div class="text-h4">
                            {{ formatDate(item?.activity?.shift_emp?.end).split(' pukul')[1] }}
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-right text-disabled">
                        <div>
                          Terakhir aktif: 
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">  
                          {{ formatDate(item?.activity?.last_active).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(item?.activity?.last_active).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
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
            <v-card v-if="latestBranch" class="bg-lightsecondary">
              <div class="pa-5 text-subtitle-2 text-medium-emphasis">
                <v-row no-gutters align="center">
                  <v-col>
                    <div :class="(!latestBranch?.operational.activity?.shift_cashier?.start || latestBranch?.operational.activity?.shift_cashier?.end) ? 'text-disabled' : 'text-secondary'">
                      <span 
                        v-if="latestBranch?.operational.activity?.shift_cashier.id"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestBranch?.operational.activity?.shift_cashier?.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestBranch?.operational.activity?.shift_cashier?.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestBranch?.operational.activity?.shift_cashier?.end ?? latestBranch?.operational.activity?.shift_cashier?.start, !!latestBranch?.operational.activity?.shift_cashier?.end) }} 
                        </span>
                      </span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis">
                        Tidak Aktif
                      </span>
                    </div>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestBranch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestBranch?.operational.activity?.shift_cashier?.meta?.created_by?.name }}</span>
                    </div>
                  </v-col>
                  <v-col class="text-right">
                    <div v-if="latestBranch?.operational.activity?.shift_cashier?.id" class="d-flex justify-end">  
                      <div v-if="!latestBranch?.operational.activity?.shift_cashier?.end">
                        <div class="text-disabled">
                          Dimulai pada: 
                        </div>
                        <div class="font-weight-bold">  
                          {{ formatDate(latestBranch?.operational.activity?.shift_cashier?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestBranch?.operational.activity?.shift_cashier?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-disabled text-right">
                        <div class="text-disabled">
                          Selesai pada: 
                        </div>
                        <div class="font-weight-bold">  
                          {{ formatDate(latestBranch?.operational.activity?.shift_cashier?.end).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestBranch?.operational.activity?.shift_cashier?.end).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-subtitle-2 text-disabled text-right">
                      Belum ada shift
                    </div>
                  </v-col>
                </v-row>
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
                    :class="!(item?.operational.activity?.last_active && item?.operational.activity?.is_active) ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                  >
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <v-row no-gutters align="center">
                      <v-col>
                        <div :class="(!item?.operational.activity?.shift_cashier?.start || item?.operational.activity?.shift_cashier?.end) ? 'text-disabled' : 'text-secondary'">
                          <span 
                            v-if="item?.operational.activity?.shift_cashier.id"
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="item?.operational.activity?.shift_cashier?.end ? 'text-success' : 'text-primary'"
                          >
                            {{ item?.operational.activity?.shift_cashier?.end ? 'Selesai: ' : 'Aktif: ' }} 
                            <span class="font-weight-bold">
                              {{ getTimeDiff(item?.operational.activity?.shift_cashier?.end ?? item?.operational.activity?.shift_cashier?.start, !!item?.operational.activity?.shift_cashier?.end) }} 
                            </span>
                          </span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis">
                            Tidak Aktif
                          </span>
                        </div>
                        <h6 class="text-h4 font-weight-bold">
                          {{ item?.name }}
                        </h6>
                        <div v-if="item?.operational.activity?.shift_cashier?.id" class="text-subtitle-2 text-disabled">
                          dimulai oleh: <span class="font-weight-bold">{{ item?.operational.activity?.shift_cashier?.meta?.created_by?.name }}</span>
                        </div>
                      </v-col>
                      <v-col class="text-right">
                        <div v-if="item?.operational.activity?.shift_cashier?.id" class="d-flex justify-end">  
                          <div v-if="!item?.operational.activity?.shift_cashier?.end">
                            <div class="text-disabled">
                              Dimulai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.operational.activity?.shift_cashier?.start).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.operational.activity?.shift_cashier?.start).split(' pukul')[1] }}
                            </div>
                          </div>
                          <div v-else class="text-subtitle-2 text-disabled text-right">
                            <div class="text-disabled">
                              Selesai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.operational.activity?.shift_cashier?.end).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.operational.activity?.shift_cashier?.end).split(' pukul')[1] }}
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          Belum ada shift
                        </div>
                      </v-col>
                    </v-row>
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
            <v-card v-if="latestShiftCashier" class="bg-lightsecondary"
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
                <v-row no-gutters align="center">
                  <v-col>
                    <div :class="(!latestShiftCashier?.start || latestShiftCashier?.end) ? 'text-disabled' : 'text-secondary'">
                      <span 
                        v-if="latestShiftCashier"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestShiftCashier?.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestShiftCashier?.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestShiftCashier?.end ?? latestShiftCashier?.start, !!latestShiftCashier?.end) }} 
                        </span>
                      </span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis">
                        Tidak Aktif
                      </span>
                    </div>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestShiftCashier?.branch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestShiftCashier?.meta?.created_by?.name }}</span>
                    </div>
                  </v-col>
                  <v-col class="text-right">
                    <div v-if="latestShiftCashier?.id" class="d-flex justify-end">  
                      <div v-if="!latestShiftCashier?.end">
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
                          {{ formatDate(latestShiftCashier?.end).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestShiftCashier?.end).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-subtitle-2 text-disabled text-right">
                      Belum ada shift
                    </div>
                  </v-col>
                </v-row>
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
                    :class="item?.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
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
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <v-row no-gutters align="center">
                      <v-col>
                        <div :class="(!item?.start || item?.end) ? 'text-disabled' : 'text-secondary'">
                          <span 
                            v-if="item"
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="item?.end ? 'text-success' : 'text-primary'"
                          >
                            {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                            <span class="font-weight-bold">
                              {{ getTimeDiff(item?.end ?? item?.start, !!item?.end) }} 
                            </span>
                          </span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis">
                            Tidak Aktif
                          </span>
                        </div>
                        <h6 class="text-h4 font-weight-bold">
                          {{ item?.branch?.name }}
                        </h6>
                        <div v-if="item?.id" class="text-subtitle-2 text-disabled">
                          dimulai oleh: <span class="font-weight-bold">{{ item?.meta?.created_by?.name }}</span>
                        </div>
                        <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span>
                      </v-col>
                      <v-col class="text-right">
                        <div v-if="item" class="d-flex justify-end">  
                          <div v-if="!item?.end">
                            <div class="text-disabled">
                              Dimulai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.start).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.start).split(' pukul')[1] }}
                            </div>
                          </div>
                          <div v-else class="text-subtitle-2 text-disabled text-right">
                            <div class="text-disabled">
                              Selesai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.end).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.end).split(' pukul')[1] }}
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          Belum ada shift
                        </div>
                      </v-col>
                    </v-row>
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
            <v-card v-if="latestBranch" class="bg-lightsecondary">
              <div class="pa-5 text-subtitle-2 text-medium-emphasis">
                <v-row no-gutters align="center">
                  <v-col>
                    <div :class="(!latestBranch?.operational.activity?.shift_kitchen?.start || latestBranch?.operational.activity?.shift_kitchen?.end) ? 'text-disabled' : 'text-secondary'">
                      <span 
                        v-if="latestBranch?.operational.activity?.shift_kitchen.id"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestBranch?.operational.activity?.shift_kitchen?.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestBranch?.operational.activity?.shift_kitchen?.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestBranch?.operational.activity?.shift_kitchen?.end ?? latestBranch?.operational.activity?.shift_kitchen?.start, !!latestBranch?.operational.activity?.shift_kitchen?.end) }} 
                        </span>
                      </span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis">
                        Tidak Aktif
                      </span>
                    </div>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestBranch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestBranch?.operational.activity?.shift_kitchen?.meta?.created_by?.name }}</span>
                    </div>
                  </v-col>
                  <v-col class="text-subtitle-2 text-medium-emphasis text-right">
                    <div v-if="latestBranch?.operational.activity?.shift_kitchen?.id" class="d-flex justify-end">  
                      <div v-if="!latestBranch?.operational.activity?.shift_kitchen?.end">
                        <div class="text-disabled">
                          Dimulai pada: 
                        </div>
                        <div class="font-weight-bold">  
                          {{ formatDate(latestBranch?.operational.activity?.shift_kitchen?.start).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestBranch?.operational.activity?.shift_kitchen?.start).split(' pukul')[1] }}
                        </div>
                      </div>
                      <div v-else class="text-subtitle-2 text-disabled text-right">
                        <div class="text-disabled">
                          Selesai pada: 
                        </div>
                        <div class="font-weight-bold">  
                          {{ formatDate(latestBranch?.operational.activity?.shift_kitchen?.end).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestBranch?.operational.activity?.shift_kitchen?.end).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-subtitle-2 text-disabled text-right">
                      Belum ada shift
                    </div>
                  </v-col>
                </v-row>
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
                    :class="(item?.operational.activity?.shift_kitchen.end || !item?.operational.activity?.shift_kitchen.id) ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
                    rounded="sm"
                  >
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <v-row no-gutters align="center">
                      <v-col>
                        <div :class="(!item?.operational.activity?.shift_kitchen?.start || item?.operational.activity?.shift_kitchen?.end) ? 'text-disabled' : 'text-secondary'">
                          <span 
                            v-if="item?.operational.activity?.shift_kitchen.id"
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="item?.operational.activity?.shift_kitchen?.end ? 'text-success' : 'text-primary'"
                          >
                            {{ item?.operational.activity?.shift_kitchen?.end ? 'Selesai: ' : 'Aktif: ' }} 
                            <span class="font-weight-bold">
                              {{ getTimeDiff(item?.operational.activity?.shift_kitchen?.end ?? item?.operational.activity?.shift_kitchen?.start, !!item?.operational.activity?.shift_kitchen?.end) }} 
                            </span>
                          </span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis">
                            Tidak Aktif
                          </span>
                        </div>
                        <h6 class="text-h4 font-weight-bold">
                          {{ item?.name }}
                        </h6>
                        <div v-if="item?.operational.activity?.shift_kitchen?.id" class="text-subtitle-2 text-disabled">
                          dimulai oleh: <span class="font-weight-bold">{{ item?.operational.activity?.shift_kitchen?.meta?.created_by?.name }}</span>
                        </div>
                      </v-col>
                      <v-col class="text-subtitle-2 text-medium-emphasis text-right">
                        <div v-if="item?.operational.activity?.shift_kitchen?.id" class="d-flex justify-end">  
                          <div v-if="!item?.operational.activity?.shift_kitchen?.end">
                            <div class="text-disabled">
                              Dimulai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.operational.activity?.shift_kitchen?.start).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.operational.activity?.shift_kitchen?.start).split(' pukul')[1] }}
                            </div>
                          </div>
                          <div v-else class="text-subtitle-2 text-disabled text-right">
                            <div class="text-disabled">
                              Selesai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.operational.activity?.shift_kitchen?.end).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.operational.activity?.shift_kitchen?.end).split(' pukul')[1] }}
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          Belum ada shift
                        </div>
                      </v-col>
                    </v-row>
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
            <v-card v-if="latestShiftKitchen" class="bg-lightsecondary"
              @click="
                openOverlay({
                  component: DetailShiftKitchen,
                  props: {
                    data: latestShiftKitchen
                  }
                })
              "
            >
              <div v-if="latestShiftKitchen" class="pa-5 text-subtitle-2 text-medium-emphasis">
                <v-row no-gutters align="center">
                  <v-col>
                    <div :class="(!latestShiftKitchen?.start || latestShiftKitchen?.end) ? 'text-disabled' : 'text-secondary'">
                      <span 
                        v-if="latestShiftKitchen"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestShiftKitchen?.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestShiftKitchen?.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestShiftKitchen?.end ?? latestShiftKitchen?.start, !!latestShiftKitchen?.end) }} 
                        </span>
                      </span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis">
                        Tidak Aktif
                      </span>
                    </div>
                    <h6 class="text-h4 font-weight-bold">
                      {{ latestShiftKitchen?.branch?.name }}
                    </h6>
                    <div class="text-subtitle-2 text-disabled">
                      dimulai oleh: <span class="font-weight-bold">{{ latestShiftKitchen?.meta?.created_by?.name }}</span>
                    </div>
                  </v-col>
                  <v-col class="text-subtitle-2 text-disabled text-right">
                    <div v-if="latestShiftKitchen?.id" class="d-flex justify-end">  
                      <div v-if="!latestShiftKitchen?.end" >
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
                          {{ formatDate(latestShiftKitchen?.end).split(' pukul')[0] }}
                        </div>
                        <div class="text-h4">
                          {{ formatDate(latestShiftKitchen?.end).split(' pukul')[1] }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-subtitle-2 text-disabled text-right">
                      Belum ada shift
                    </div>
                  </v-col>
                </v-row>
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
                    :class="item?.end ? 'text-disabled' : 'text-medium-emphasis text-secondary'"
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
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <v-row no-gutters align="center">
                      <v-col>
                        <div :class="(!item?.start || item?.end) ? 'text-disabled' : 'text-secondary'">
                          <span 
                            v-if="item"
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="item?.end ? 'text-success' : 'text-primary'"
                          >
                            {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                            <span class="font-weight-bold">
                              {{ getTimeDiff(item?.end ?? item?.start, !!item?.end) }} 
                            </span>
                          </span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis">
                            Tidak Aktif
                          </span>
                        </div>
                        <h6 class="text-h4 font-weight-bold">
                          {{ item?.branch?.name }}
                        </h6>
                        <div v-if="item?.id" class="text-subtitle-2 text-disabled">
                          dimulai oleh: <span class="font-weight-bold">{{ item?.meta?.created_by?.name }}</span>
                        </div>
                      </v-col>
                      <v-col class="text-subtitle-2 text-disabled text-right">
                        <div v-if="item" class="d-flex justify-end">  
                          <div v-if="!item?.end">
                            <div class="text-disabled">
                              Dimulai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.start).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.start).split(' pukul')[1] }}
                            </div>
                          </div>
                          <div v-else class="text-subtitle-2 text-disabled text-right">
                            <div class="text-disabled">
                              Selesai pada: 
                            </div>
                            <div class="font-weight-bold">  
                              {{ formatDate(item?.end).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.end).split(' pukul')[1] }}
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-subtitle-2 text-disabled text-right">
                          Belum ada shift
                        </div>
                      </v-col>
                    </v-row>
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
          <div>
            <v-card 
              v-if="latestShiftWarehouse"
              class="bg-lightsecondary pa-5"
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
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-row class="align-center justify-space-between">
                  <v-col>
                      <span 
                        v-if="latestShiftWarehouse?.start"
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="latestShiftWarehouse?.end ? 'text-success' : 'text-primary'"
                      >
                        {{ latestShiftWarehouse?.end ? 'Selesai: ' : 'Aktif: ' }} 
                        <span class="font-weight-bold">
                          {{ getTimeDiff(latestShiftWarehouse?.end ?? latestShiftWarehouse?.start, !!latestShiftWarehouse?.end) }}
                        </span>
                      </span>
                      <span
                        v-else
                        class="text-subtitle-2 text-medium-emphasis"
                      >
                        Tidak Aktif
                      </span>
                      <h6 :class="(!latestShiftWarehouse?.start || latestShiftWarehouse?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                        {{ latestShiftWarehouse?.meta?.created_by?.name }}
                      </h6>
                  </v-col>
                  <v-col class="text-right">
                    <div v-if="!latestShiftWarehouse?.end">
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
                    <div v-else>
                      <div class="text-disabled">
                        Selesai pada: 
                      </div>
                      <div class="text-subtitle-2 font-weight-bold">  
                        {{ formatDate(latestShiftWarehouse?.end).split(' pukul')[0] }}
                      </div>
                      <div class="text-h4">
                        {{ formatDate(latestShiftWarehouse?.end).split(' pukul')[1] }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
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
                    <v-divider v-if="i !== 0" class="my-3"/>
                    <div class="text-subtitle-2 text-medium-emphasis">
                      <v-row no-gutters class="align-center justify-space-between">
                        <v-col>
                            <span 
                              v-if="item?.start"
                              class="text-subtitle-2 text-medium-emphasis"
                              :class="item?.end ? 'text-success' : 'text-primary'"
                            >
                              {{ item?.end ? 'Selesai: ' : 'Aktif: ' }} 
                              <span class="font-weight-bold">
                                {{ getTimeDiff(item?.end ?? item?.start, !!item?.end) }}
                              </span>
                            </span>
                            <span
                              v-else
                              class="text-subtitle-2 text-medium-emphasis"
                            >
                              Tidak Aktif
                            </span>
                            <h6 :class="(!item?.start || item?.end) ? '' : 'text-secondary'" class="text-h4 font-weight-bold">
                              {{ item?.meta?.created_by?.name }}
                            </h6>
                        </v-col>
                        <v-col class="text-right">
                          <div v-if="!item?.end">
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
                          <div v-else>
                            <div class="text-disabled">
                              Selesai pada: 
                            </div>
                            <div class="text-subtitle-2 font-weight-bold">  
                              {{ formatDate(item?.end).split(' pukul')[0] }}
                            </div>
                            <div class="text-h4">
                              {{ formatDate(item?.end).split(' pukul')[1] }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
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