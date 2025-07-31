<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import DetailCategory from './sub-components/inventory-item/DetailCategory.vue';

import type { Category, InventoryItem, CreateInventoryItemPayload, UpdateInventoryItemPayload } from '@/types/inventory';

import { getTimeDiff } from '@/utils/helpers/time';
import { formatRupiahInput } from '@/utils/helpers/currency';
import { formatDate } from '@/utils/helpers/format-date';

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import DetailItem from './sub-components/inventory-item/DetailItem.vue';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data: InventoryItem[];
  categories: Category[];
  loading: boolean;

  refresh: () => void
}>();

const selectedCtg = ref<string | null>('all')
const in_category = ref(false)
const isChanged = ref(false)

function openAddNew() {
  if (in_category.value){
    openOverlay({
      component: DetailCategory,
      props: {
        is_create: true,
        isChanged,
        confirmBeforeClose: true,
        refresh: props.refresh
      }
    })
  } else {
    openOverlay({
      component: DetailItem,
      props: {
        is_create: true,
        categories: props.categories,
        isChanged,
        confirmBeforeClose: true,
        refresh: props.refresh
      }
    })
  }
}

function openDetail(item: InventoryItem) {
  openOverlay({
    component: DetailItem,
    props: {
      data: item,
      categories: props.categories,
      refresh: props.refresh
    }
  })
}

const categories = computed(() => props.categories)
const select_ctgs = computed(() => [{ id: 'all', name: 'Semua' }, { id: 'new', name: 'Baru' }, ...props.categories])

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  if (selectedCtg.value === 'new') return props.data.filter(item => item.is_new)
  return props.data.filter(item => item.category?.id === selectedCtg.value)
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row align="end">
          <v-col cols="8">
            <h4 class="text-h4 mt-1">{{in_category ? 'Daftar Kategori' : 'Stok Gudang'}}</h4>
          </v-col>
          <v-col cols="4" class="mt-auto">
            <div class="d-flex justify-end align-center">
              <v-btn
                icon
                variant="text"
                class="mr-1"
                size="small"
                @click="in_category = !in_category"
              >
                <v-icon opacity="0.4" size="large">mdi-format-list-bulleted-type</v-icon>
              </v-btn>

              <!-- vertical divider -->
              <v-divider vertical inset/>
              
              <span v-if="!loading">
                <v-btn
                  v-if="in_category"
                  class="ml-3"
                  color="secondary"
                  @click="
                    openOverlay({
                      component: DetailCategory,
                      props: {
                        is_create: true,
                        confirmBeforeClose: true,
                        isChanged,
                        refresh: props.refresh
                      }
                    })
                  "
                >
                  Tambah
                </v-btn>
                <v-btn
                  v-else
                  class="ml-3"
                  color="primary"
                  @click="openAddNew"
                >
                  Tambah
                </v-btn>
              </span>
            </div>
          </v-col>
        </v-row>
        
        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>
        
        <v-row v-if="!props.loading && !in_category" class="mt-3">
          <v-col cols="12">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="selectedCtg"
              :items="select_ctgs"
              item-title="name"
              item-value="id"
              label="Pilih Kategori"
              :loading="props.loading"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <div class="mt-4" v-if="!props.loading && !in_category">
          <ScrollContainer :maxHeight="mdAndUp ? '20rem' : '15rem'">
            <v-list v-if="currentData.length > 0" class="py-0">
              <v-list-item
                v-for="(item, i) in currentData"
                :key="i"
                :value="item"
                color="secondary"
                rounded="sm"
                @click="openDetail(item)"
              >
                <span 
                  v-if="!item?.is_new"
                  class="text-subtitle-2 text-disabled"
                  :class="{
                    'text-error': (item?.expired_date && getTimeDiff(item?.expired_date) === 'sekarang') || (item?.expired_date && getTimeDiff(item?.expired_date).includes('lalu')),
                    'text-warning': (item?.expired_date && getTimeDiff(item?.expired_date) === '1 hari lagi')
                  }"
                >
                  {{ (item?.expired_date && getTimeDiff(item?.expired_date) === 'sekarang') || (item?.expired_date && getTimeDiff(item?.expired_date).includes('lalu')) ? 'Sudah expired' : 'Exp: ' + (item?.expired_date && getTimeDiff(item?.expired_date)) }}
                </span>
                <span
                  v-else
                  class="text-subtitle-2 text-disabled text-success"
                >
                  Baru
                </span>
                <div 
                  class="d-flex justify-space-between align-start w-100">
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <h6
                      :class="{'text-disabled': (!item?.expired_date || getTimeDiff(item?.expired_date) === 'sekarang') || item?.expired_date && getTimeDiff(item?.expired_date).includes('lalu')}"
                      class="text-h4 text-medium-emphasis font-weight-bold"
                      style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    >
                      {{ item?.name }}
                    </h6>
                    <div style="height: fit-content; max-height: 3rem; overflow: auto; scrollbar-width: none;" @wheel.stop @touchmove.stop @scroll.stop>
                      <i class="text-subtitle-2 text-disabled">
                        {{ item?.description || '-'}}
                      </i>
                    </div>
                  </div>

                  <!-- Kolom kanan -->
                  <div class="text-right min-w-[120px]" v-if="!item.is_new">
                    <div class="d-flex justify-end">
                      <span
                        v-if="item?.quantity > item?.threshold"
                        class="text-subtitle-2 text-medium-emphasis text-success"
                      >
                        Stok Aman
                      </span>
                      <span
                        v-else-if="item?.quantity <= item?.threshold"
                        class="text-subtitle-2 text-medium-emphasis text-warning"
                      >
                        Segera Restok
                      </span>
                    </div>
                    <div
                      v-if="item?.quantity >= 0"
                      class="text-subtitle-1 text-medium-emphasis font-weight-bold my-1"
                    >
                      <span class="text-subtitle-2 text-medium-emphasis">Tersisa:</span> {{ item?.quantity }}
                    </div>
                    <div
                      v-else
                      class="text-subtitle-1 text-medium-emphasis font-weight-bold"
                    >
                      Stok Habis
                    </div>
                  </div>
                </div>

                <v-divider class="my-3" />
              </v-list-item>
            </v-list>
            <div v-else class="text-subtitle-1 text-disabled text-center my-3">Data kosong</div>
          </ScrollContainer>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/inventory-items">
              Lihat Semua
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
        
        <div class="mt-4" v-if="!props.loading && in_category">
          <ScrollContainer :maxHeight="mdAndUp ? '20rem' : '15rem'">
            <v-list>
              <v-list-item
                v-for="(data, i) in categories"
                :key="i"
                :value="data"
                rounded="sm"
                @click="
                  openOverlay({
                    component: DetailCategory,
                    props: { 
                      data: data,
                      confirmBeforeClose: true,
                      isChanged,
                      refresh: props.refresh
                    },
                  })
                "
              >
                <v-divider v-if="i > 0" class="mb-4 mt-2"></v-divider>
                <div class="d-flex justify-space-between w-100">
                  <div class="pe-4" style="flex: 1">
                    <h6 class="text-h4 text-medium-emphasis font-weight-bold">
                      {{ data?.name }}
                    </h6>
                    <div style="height: fit-content; max-height: 3rem; overflow: auto; scrollbar-width: none;" @wheel.stop @touchmove.stop @scroll.stop>
                      <i class="text-subtitle-2 text-disabled">
                        {{ data?.description || '-'}}
                      </i>
                    </div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </ScrollContainer>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style>
.custom-select .v-field__input {
  font-size: 0.8rem !important;
}
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>