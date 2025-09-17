<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()

import type { Category, StockMovement, InventoryItem } from '@/types/inventory';
import type { Branch } from '@/types/branch';

import { formatDate } from '@/utils/helpers/format-date';
import { useUserStore } from '@/stores/authUser';

import { useInventoryItems } from '@/composables/useInventoryItems';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import DetailStockMovement from './sub-components/stock-movement/DetailStockMovement.vue';
import ScrollContainer from '@/components/shared/ScrollContainer.vue';
const userStore = useUserStore();

const { init: initItems, data: inventoryItem, categories: ctg, loading: li } = useInventoryItems();

onMounted(() => {
  initItems();
});

const props = defineProps<{
  data: StockMovement[];
  inv_item: InventoryItem[];
  categories: Category[];
  branches: Branch[];
  loading: boolean;
  refresh: () => void
}>();

const categories = computed(() => {
  if (!props.categories.length) return []
  return [{ id: 'all', name: 'Semua' }, { id: 'new', name: 'Baru' }, ...props.categories];
})

const branches = computed(() => {
  if (!props.branches.length) return []
  return props.branches;
})

const isChanged = ref(false)

const selectedCtg = ref<string | null>('all')
const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.item.category?.id === selectedCtg.value)
})

function openDetail(data: StockMovement) {
  openOverlay({
    component: DetailStockMovement,
    props: {
      data,
      inv_item: props.inv_item,
      categories: props.categories,
      branches,
      isChanged,
      confirmBeforeClose: true,
      refresh: () => props.refresh()
    }
  })
}

function openAddNew() {
  openOverlay({
    component: DetailStockMovement,
    props: {
      is_create: true,
      inv_item: props.inv_item,
      categories: props.categories,
      branches: branches,
      isChanged,
      confirmBeforeClose: true,
      refresh: () => props.refresh()
    }
  })
}
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row class="justify-space-between">
          <v-col cols="8" >
            <h4 class="text-h4 mt-1">Perpindahan Stok</h4>
          </v-col>
          <v-col cols="4" class="mt-auto text-right">
            <v-btn
              v-if="!loading"
              color="primary"
              @click="openAddNew"
            >
              Tambah
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="selectedCtg"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Pilih Kategori"
              :loading="loading"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <div class="my-4" v-if="!props.loading">
          <ScrollContainer :style="{ maxHeight: mdAndUp? '18rem' : '15rem'}">
            <v-list v-if="currentData.length > 0" class="py-0">
              <v-list-item
                v-for="(item, i) in currentData"
                :key="i"
                :value="item"
                color="secondary"
                rounded="sm"
                @click="openDetail(item)"
              >
              <v-divider v-if="i !== 0" class="my-3" />
              <i class="text-subtitle-2 text-disabled">
                {{ item.time ? formatDate(new Date(item?.time)).slice(0, -12)+': '+formatDate(new Date(item?.time)).slice(-5) : '-' }}
              </i>

                <div class="d-flex justify-space-between align-start w-100" >
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <span class="text-subtitle-2 text-disabled">
                      {{ item?.branch?.name }}
                    </span>
                    <h6
                      class="text-h4 text-medium-emphasis font-weight-bold"
                      style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    >
                      {{ item?.item.name }}
                    </h6>
                    <i class="text-subtitle-2 text-disabled">{{ item?.description }}</i>
                  </div>

                  <!-- Kolom kanan -->
                  <div class="text-right min-w-[120px]">
                    <div class="d-flex justify-end">
                      <span 
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="{
                          'text-success': item?.status === 'Masuk',
                          'text-error': item?.status === 'Keluar',
                          'text-warning': item?.status === 'Pengurangan'
                        }"
                      >
                        {{ item?.status }}
                      </span>
                    </div>
                    <div
                      v-if="item?.item.quantity! >= 0"
                      class="text-subtitle-1 text-medium-emphasis font-weight-bold my-1"
                    >
                      {{ item?.item.quantity != null && item?.item.unit ? `${item.item.quantity} ${item.item.unit}` : '-' }}
                    </div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
            <!-- jika data kosong -->
            <div v-else class="text-center text-subtitle-2 text-disabled my-4">
              Data Perpindahan Stok tidak ditemukan
            </div>
          </ScrollContainer>


          <!-- <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/inventory-items">
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