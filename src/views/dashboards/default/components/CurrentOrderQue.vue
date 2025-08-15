<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { getTimeDiff } from "@/utils/helpers/time";

import type { Order, OrderItem } from '@/types/order';
import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import DetailOrder from './sub-components/order/DetailOrder.vue';
import { useMenuItems } from '@/composables/useMenuItems';

import ScrollContainer from '@/components/shared/ScrollContainer.vue';
import type { MenuSale } from '@/types/menu';

const { loadItemSales, dataItemSales: menuSales, categories, loading: lm } = useMenuItems();
const { openOverlay } = useOverlayManager()

onMounted(() => {
  loadItemSales()
})

const props = defineProps<{
  data: Order[];
  data_menu: MenuSale[];
  branch: IdName | undefined | null;
  loading: boolean;

  refresh: () => void
}>();

const orders = computed(() => {
  return props.data || []
});

const filteredData = computed(() => {
  let data = orders.value
  data = orders.value.filter((tx) => {
    const isActiveMatch = isActive.value
      ? tx.status === 'Diproses' || tx.status === 'Pending' || tx.status === 'Tersaji'
      : tx.status === 'Selesai' || tx.status === 'Batal' || tx.status === 'Refund';

    const isDineInMatch = isDineIn.value !== undefined
      ? isDineIn.value === !tx.is_take_away
      : true;

    return isActiveMatch && isDineInMatch;
  });
  return data
})

// Ambil permintaan terbaru
const latestOrderQue = computed(() => filteredData?.value[0] || null);

// Sisanya untuk list biasa
const listOrderQue = computed(() => filteredData?.value.slice(1) || []);

const isActive = ref(true)
const isDineIn = ref()
const isChanged = ref(false);
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
            @click="
              openOverlay({
                component: DetailOrder,
                props: {
                  data_order: latestOrderQue,
                  data_menu: menuSales,
                  categories: categories,
                  refresh: () => props.refresh()
                }
              })
            "
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
                  <h4 class="text-h4 text-right">{{ getTimeDiff(latestOrderQue.meta.updated_at) }}</h4>
                  <i v-if="latestOrderQue?.meta?.updated_at.getTime() !== latestOrderQue?.meta?.created_at.getTime()" class="text-subtitle-2 text-disabled">
                    Diubah {{ getTimeDiff(latestOrderQue.meta.updated_at) }}
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
                  @click="
                    openOverlay({
                      component: DetailOrder,
                      props: {
                        data_order: item,
                        data_menu: menuSales,
                        categories: categories,
                        refresh: () => props.refresh()
                      }
                    })
                  "
                >
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
                            'text-primary': item?.status === 'Diproses',
                            'text-secondary': item?.status === 'Tersaji'
                          }"
                        >{{ item?.status }}</span>
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeDiff(item.meta.created_at) }}</div>
                      <i v-if="item?.meta?.updated_at.getTime() !== item?.meta?.created_at.getTime()" class="text-subtitle-2.getTime() text-disabled">
                        Diubah {{ getTimeDiff(item.meta.updated_at) }}
                      </i>
                    </div>
                  </div>
                  <v-divider class="my-3"/>
                </v-list-item>
              </v-list>
            </ScrollContainer>
            <!-- jika data kosong -->
            <div 
              v-if="!latestOrderQue" 
              class="text-center text-subtitle-2 text-disabled my-4"
            >
              Belum ada pesanan, nih!
            </div>
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