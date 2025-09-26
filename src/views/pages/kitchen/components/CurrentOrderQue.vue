<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { getTimeDiff } from "@/utils/helpers/time";

import type { Order, OrderItem } from '@/types/order';
import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import DetailOrder from '../../cashier/components/sub-components/DetailOrder.vue';
import { useMenu } from '@/composables/useMenuItems';

import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import type { ShiftKitchen } from '@/types/shift';
import type { MenuSale } from '@/types/menu';

const { loadCategory, categories, loading: lm } = useMenu();
const { openOverlay } = useOverlayManager()

onMounted(() => {
  loadCategory()
})

const props = defineProps<{
  data: Order[];
  data_menu: MenuSale[];
  branch: IdName | undefined | null;
  loading: boolean;

  // load: (filter: Record<string, any>) => Order
  refresh: () => void
}>();

const data_menu = computed(() => {
  return props.data_menu
})

// Computed untuk filter transaksi berdasarkan branch
const filteredDataByBranch = computed(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx?.branch?.id == props.branch?.id
  );
});

const filteredData = computed(() => {
  console.log('filteredDataByBranch.value', filteredDataByBranch.value)
  let data = filteredDataByBranch.value
  data = filteredDataByBranch.value.filter((tx) => {
    const isActiveMatch = isActive.value
      ? tx.status === 'Diproses' || tx.status === 'Pending' || tx.status === 'Tersaji'
      : tx.status === 'Selesai' || tx.status === 'Batal' || tx.status === 'Refund';

    const isDineInMatch = isDineIn.value !== undefined
      ? isDineIn.value === !tx.is_take_away
      : true;

    return isActiveMatch && isDineInMatch;
  });
  return isActive.value ? data : data.slice().sort((a, b) => new Date(b?.meta.updated_at).getTime() - new Date(a?.meta.updated_at).getTime());
})

// Ambil permintaan terbaru
const latestOrderQue = computed(() => filteredData?.value[0] || null);

// Sisanya untuk list biasa
const listOrderQue = computed(() => filteredData?.value.slice(1) || []);

const cashInput = ref('')
const cashNumber = ref(0)
const isActive = ref(true)
const isDineIn = ref()

watch(() => cashInput.value, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  cashNumber.value = numeric ? Number(numeric) : 0
})

function openDetailOrder(id: string) {
  openOverlay({
    component: DetailOrder,
    props: {
      get data_order() { return filteredData.value.find(tx => tx.id === id) },
      data_menu: data_menu,
      categories: categories,
      loading: props.loading,
      refresh: () => props.refresh()
    },
  })
}
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row align="center" no-gutters>
          <v-col >
            <h4 class="text-h4 mt-1">
              Antrian Pesanan {{ isActive ? 'Aktif' : 'Selesai' }}
              <v-btn
                icon
                variant="text"
                density="compact"
                size="small"
                @click="isActive = !isActive"
              >
                <v-icon>mdi-swap-vertical</v-icon></v-btn>
            </h4>
            <span class="text-subtitle-2 text-medium-emphasis">{{ props.branch?.name }}</span>
          </v-col>
          <v-col cols="auto">
            <!-- refresh button -->
            <v-btn
              icon
              variant="text"
              class="text-medium-emphasis"
              @click="props.refresh()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center mt-4">
            <v-btn-toggle
              v-model="isDineIn"
              variant="outlined"
              color="primary"
            >
              <v-btn color="primary" :value="true" >
                Makan Di Tempat
              </v-btn>
              <v-btn color="secondary" :value="false">
                Bawa Pulang
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-5"
            @click="openDetailOrder(latestOrderQue?.id)"
          >
            <div v-if="latestOrderQue" class="pa-5">
              <span>
                {{ latestOrderQue?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }} 
              </span> 
              <span v-if="!latestOrderQue?.is_take_away" class="text-subtitle-2 text-medium-emphasis">
                : Meja {{ latestOrderQue?.table_number }} 
              </span>
              <div class="d-inline-flex align-center justify-space-between w-100">
                <div>
                  <h6 class="text-secondary text-h4 font-weight-bold">
                    {{ latestOrderQue?.customer?.name }}
                  </h6>
                  <div class="text-secondary text-subtitle-2 text-medium-emphasis">
                    {{ latestOrderQue?.items?.length }} item
                  </div>
                  <span class="text-subtitle-2 text-disabled">
                    Lihat Detail
                  </span>
                </div>
                <div>
                  <div class="d-flex justify-end">  
                    <span 
                      class="text-subtitle-2 text-medium-emphasis"
                      :class="{
                        'text-success': latestOrderQue?.status === 'Selesai',
                        'text-error': latestOrderQue?.status === 'Batal',
                        'text-warning': latestOrderQue?.status === 'Pending',
                        'text-primary': latestOrderQue?.status === 'Diproses'
                      }"
                    >{{ latestOrderQue?.status }}</span>
                  </div>
                  <h4 class="text-h4 text-right">{{ getTimeDiff(latestOrderQue?.meta.updated_at) }}</h4>
                  <i v-if="latestOrderQue?.meta?.updated_at !== latestOrderQue?.meta?.created_at" class="text-subtitle-2 text-disabled">
                    Dibuat {{ getTimeDiff(latestOrderQue?.meta.created_at) }}
                  </i>
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4" >
            <ScrollContainer :style="{ maxHeight: mdAndUp? '25rem' : '15rem'}">
              <v-list v-if="listOrderQue?.length > 0" class="py-0">
                <v-list-item 
                  v-for="(item, i) in listOrderQue" 
                  :key="i" 
                  :value="item"
                  color="secondary"
                  rounded="sm"
                  @click="openDetailOrder(item?.id)"
                >
                  <v-divider v-if="i !== 0" class="my-3"/>
                  <span class="text-subtitle-2 text-medium-emphasis">
                    {{ item?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }} 
                  </span> 
                  <span v-if="!item?.is_take_away" class="text-subtitle-2 text-disabled">
                    : Meja {{ item?.table_number }} 
                  </span>
                  <div class="d-inline-flex align-center justify-space-between w-100">
                    <div>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                        {{ item?.customer?.name }}
                      </h6>
                      <div class="text-subtitle-2 text-medium-emphasis">
                        {{ item?.items?.length }} item
                      </div>
                      <span class="text-subtitle-2 text-disabled">
                        Lihat Detail
                      </span>
                    </div>
                    <div>
                      <div class="d-flex justify-end">
                        <span 
                          class="text-subtitle-2 text-medium-emphasis"
                          :class="{
                            'text-success': item?.status === 'Selesai',
                            'text-error': item?.status === 'Batal',
                            'text-warning': item?.status === 'Pending',
                            'text-primary': item?.status === 'Diproses'
                          }"
                        >{{ item?.status }}</span>
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeDiff(item?.meta.updated_at) }}</div>
                      <i class="text-subtitle-2 text-disabled">
                        Dibuat {{ getTimeDiff(item?.meta.created_at) }}
                      </i>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </ScrollContainer>
            <!-- jika data kosong -->
            <div 
              v-if="!latestOrderQue && listOrderQue?.length === 0" 
              class="text-center text-subtitle-2 text-disabled mt-4"
            >
              Pesanan Kosong
            </div>

            <!-- <div class="text-center mt-3">
              <v-btn color="primary" variant="text" href="/Order"
                >View All
                <template v-slot:append>
                  <ChevronRightIcon stroke-width="1.5" width="20" />
                </template>
              </v-btn>
            </div> -->
          </div>
        </div>
        <div v-else class="ml-auto">
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