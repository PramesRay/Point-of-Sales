<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import DetailCategory from './sub-components/DetailCategory.vue';

import type { Category, InventoryItem, CreateInventoryItemPayload, UpdateInventoryItemPayload } from '@/types/inventory';

import { useInventoryItems } from '@/composables/useInventoryItems';

import { getTimeDiff } from '@/utils/helpers/time';
import { formatRupiahInput } from '@/utils/helpers/currency';
import { formatDate } from '@/utils/helpers/format-date';

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

const { openOverlay } = useOverlayManager()
const { loadCategory, categories: ctg, loading: li } = useInventoryItems();

onMounted(() => {
  loadCategory();
});

const emit = defineEmits<{
  (e: 'create-item', payload: CreateInventoryItemPayload): InventoryItem
  (e: 'update-item', payload: UpdateInventoryItemPayload): InventoryItem
  (e: 'delete-item', id: string): void
}>();

const props = defineProps<{
  data: InventoryItem[];
  categories: Category[];
  loading: boolean;

  refresh: () => void
}>();

const showOverlay = ref(false)
const formRef = ref()
const isFormValid = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const expModal = ref(false)

const selectedItem = ref<InventoryItem | null>(null)
const payload = ref<{[K in keyof UpdateInventoryItemPayload]: UpdateInventoryItemPayload[K] | null}>({
  id: null,
  name: null,
  description: null,
  category_id: null,
  purchase_price: null,
  threshold: null,
  unit: null,
  expired_date: null
})
const selectedCtg = ref<string | null>('all')
const action = ref<'create' | 'update' | 'delete' | 'category' | null>(null)
const inputCurrency = ref('')
const formattedDate = computed(() => payload.value.expired_date ? formatDate(payload.value.expired_date).split(' pukul')[0] : '')

const rules = {
  required_text: [(v: string) => !!v || 'Data tidak boleh kosong'],
  required_number: [(v: number) => !!v || 'Data tidak boleh kosong'],
  phone: [(v: string) => v.length <= 15 || 'Nomor telepon maksimal 15 digit'],
  people: [(v: number) => v >= 2 || 'Jumlah minimal 2 orang', (v: number) => v <= 20 || 'Jumlah maksimal 20 orang'],
  desc: [(v: string) => v.length <= 100 || 'Deskripsi maksimal 100 karakter'],
}

const cautions = {
  unit_changed: 'Pastikan harga beli, threshold, dan jumlah barang juga disesuaikan',
  quantity_changed: "Data perpindahan barang akan otomatis terbuat dengan status 'Penyesuaian'"
}

function clearPayload() {
  if (selectedItem.value) {
    payload.value = {
      id: selectedItem.value.id,
      name: selectedItem.value.name,
      description: selectedItem.value.description,
      category_id: selectedItem.value.category.id,
      purchase_price: selectedItem.value.purchase_price,
      threshold: selectedItem.value.threshold,
      unit: selectedItem.value.unit,
      expired_date: selectedItem.value.expired_date

    }
  } else if (action.value === 'create') {
    payload.value = {
      id: null,
      name: null,
      description: null,
      category_id: null,
      purchase_price: null,
      threshold: null,
      unit: null,
      expired_date: null
    }
  }
  inputCurrency.value = ''
}

function openAddNew() {
  selectedItem.value = null
  action.value = 'create'
  clearPayload()

  showOverlay.value = true
}

function openDetail(request: InventoryItem) {
  selectedItem.value = cloneDeep(request)
  action.value = 'update'
  showOverlay.value = true

  console.log('selectedItem.value', selectedItem.value)
}

const isChanged = computed(() => {
  if (!payload.value || !selectedItem.value) return false
  if (action.value === 'create') {
    return (
      payload.value.name !== null ||
      payload.value.description !== null ||
      payload.value.purchase_price !== 0 ||
      payload.value.unit !== null ||
      payload.value.threshold !== 0 ||
      payload.value.category_id !== null
  )} else if (action.value === 'update') {
    return (
      payload.value.name !== selectedItem.value.name ||
      payload.value.description !== selectedItem.value.description ||
      payload.value.threshold !== selectedItem.value.threshold ||
      payload.value.purchase_price !== selectedItem.value.purchase_price ||
      payload.value.unit !== selectedItem.value.unit ||
      payload.value.category_id !== selectedItem.value.category?.id
    )
  }
})

const categories = computed(() => props.categories)
const select_ctgs = computed(() => [{ id: 'all', name: 'Semua' }, { id: 'new', name: 'Baru' }, ...props.categories])

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  if (selectedCtg.value === 'new') return props.data.filter(item => item.is_new)
  return props.data.filter(item => item.category?.id === selectedCtg.value)
})

function processInventoryItem() {
  if (!payload.value) return
  console.log('action.value', action.value)
  
  if (action.value === 'delete') {
    console.log('Menghapus item:', selectedItem.value)
    emit('delete-item', payload.value.id as string)
  
  } else if (action.value === 'create') {
    console.log('Membuat item baru:', payload)
    const createPayload: CreateInventoryItemPayload = {
      name: payload.value.name ?? '',
      description: payload.value.description ?? '',
      unit: payload.value.unit ?? '',
      purchase_price: payload.value.purchase_price ?? 0,
      threshold: payload.value.threshold ?? 0,
      category_id: payload.value.category_id ?? '',
    }
    emit('create-item', createPayload as CreateInventoryItemPayload)
  
  } else if (action.value === 'update') {
    console.log('Mengubah item:', payload.value)
    emit('update-item', payload.value as UpdateInventoryItemPayload)
  }
  
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    console.log('action.value', action.value)
    processInventoryItem()
  })
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false
  action.value = null
  
  clearPayload()
}

// watch(
//   () => props.categories,
//   (newCategories) => {
//     if (newCategories?.length && !selectedCtg.value) {
//       selectedCtg.value = newCategories[0].id
//     }
//   },
//   { immediate: true }
// )

watch(selectedItem, (val) => {
  if (val) {
    payload.value = {
      ...val,
      name: val.name,
      description: val.description ?? null,
      purchase_price: val.purchase_price ?? null,
      threshold: val.threshold ?? 0,
      category_id: val.category.id ?? null,
      unit: val.unit ?? null
    }
    inputCurrency.value = formatRupiahInput(val.purchase_price.toString())
  }
})

watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    action.value = null
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      pendingOverlayClose.value = false
      return
    }

    // Jika ada perubahan tapi belum dikonfirmasi, batalkan penutupan overlay dan tampilkan dialog
    if (isChanged.value) {
      showOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    }
  }
})

watch(() => inputCurrency.value, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  payload.value.purchase_price = numeric ? Number(numeric) : 0
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row align="center">
          <v-col cols="8">
            <h4 class="text-h4 mt-1">{{action == 'category' ? 'Daftar Kategori' : 'Stok Gudang'}}</h4>
          </v-col>
          <v-col cols="4" class="mt-auto">
            <div class="d-flex justify-end align-center">
              <v-btn
                icon
                variant="text"
                class="mr-1"
                size="small"
                @click="action == 'category' ? action = null : action = 'category'"
              >
                <v-icon opacity="0.4" size="large">mdi-format-list-bulleted-type</v-icon>
              </v-btn>

              <!-- vertical divider -->
              <v-divider vertical inset/>
              
              <span v-if="!loading">
                <v-btn
                  v-if="action === 'category'"
                  class="ml-3"
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
        
        <v-row v-if="!props.loading && action !== 'category'">
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

        <div class="mt-4" v-if="!props.loading && action !== 'category'">
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
        
        <div class="mt-4" v-else>
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
  
  <v-overlay
    v-model="showOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
    max-width="400"
  >
    <v-card 
      class="rounded-lg pa-6 mt-8 bg-white" 
      style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
    >
      <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="d-flex align-center">
        <h4 class="text-h4 mt-1"> {{action === 'create' ? 'Buat Informasi Barang' : 'Ubah Informasi Barang'}} </h4>
      </div>

      <v-divider class="my-3" />

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-row class="justify-center">
          <v-col :cols="action === 'create' ? 12 : 6">
            <v-select
              variant="underlined"
              v-model="payload.category_id"
              :loading="li"
              :items="ctg"
              item-title="name"
              item-value="id"
              label="Kategori"
              prepend-icon="mdi-format-list-bulleted-type"
              :rules="rules.required_text"
              :return-object="false"
            />
          </v-col>
          <!-- expired date -->
          <v-col cols="6" v-if="action && action === 'update'">
            <v-text-field
              v-model="formattedDate"
              label="Tanggal Expired"
              prepend-icon="mdi-calendar"
              readonly
              :active="expModal"
              :focused="expModal"
              variant="underlined"
              :rules="rules.required_text"
            />
            <v-dialog
              v-model="expModal"
              activator="parent"
              transition="scale-transition"
              offset-y
              max-width="290"
              min-width="290"
            >
              <v-date-picker
                v-model="payload.expired_date"
                @update:model-value="expModal = false"
                no-title
                scrollable
              />
            </v-dialog>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="underlined"
              v-model="payload.name"
              label="Nama Barang"
              :rules="rules.required_text"
              prepend-icon="mdi-form-textbox"
            />
          </v-col>  
          <v-col cols="6">
            <v-text-field
              variant="underlined"
              v-model="inputCurrency"
              label="Harga Beli"
              :min="0"
              prefix="Rp"
              :rules="rules.required_number"
              prepend-icon="mdi-cash"
              @input="inputCurrency = formatRupiahInput(inputCurrency)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <v-combobox
              v-model="payload.unit"
              variant="underlined"
              :items="['pcs', 'kg', 'ltr', 'box']"
              label="Satuan"
              :rules="rules.required_text"
              prepend-icon="mdi-scale-balance"
            />
          </v-col>
          <v-col cols="7">
            <v-number-input
              v-model="payload.threshold"
              control-variant="split"
              variant="plain"
              label="Threshold"
              :min="0"
              :rules="rules.required_number"
              prepend-icon="mdi-alert"
              inset
            />
          </v-col>
        </v-row>

        <!-- quantity -->

        <v-row class="text-caption text-medium-emphasis">
          <v-col>
            <v-textarea
              v-model="payload.description"
              label="Deskripsi Barang: "
              :rules="rules.desc && rules.required_text"
              variant="underlined"
              prepend-icon="mdi-text-box"
              rows="2"
              auto-grow
              clearable
              counter
            />
          </v-col>
        </v-row>

        <v-divider class="my-3" />
        
        <div>
          <div class="d-flex align-center justify-end mt-1">
            <!-- delete button -->
            <v-btn
              v-if="action && action === 'update'"
              icon
              variant="text"
              class="mr-1 text-error"
              density="compact"
              @click="pendingOverlayClose = true, action = 'delete', showConfirmDialog = true"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <!-- vertical divider -->
            <v-divider v-if="action && action === 'update'" vertical inset/>
            
            <v-btn
              class="ms-2"
              color="primary"
              :disabled="!isFormValid"
              :loading="props.loading"
              type="submit"
            >
              Simpan
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card>
  </v-overlay>
  
  <v-dialog v-model="showConfirmDialog" persistent max-width="400">
    <v-card 
      class="pa-3"
      v-if="action === 'delete' && pendingOverlayClose"
      >
      <v-card-title class="text-h3">Hapus Item?</v-card-title>
        <v-card-text 
          class="text-subtitle-1 text-medium-emphasis"
          >
          Apakah Anda yakin ingin menghapus <span class="font-weight-bold"> {{selectedItem?.name}} </span> dari daftar barang?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showConfirmDialog = false, pendingOverlayClose = false, action = null">Kembali</v-btn>
          <v-btn variant="elevated" color="error" @click="action = 'delete', processInventoryItem()">Ya, Hapus</v-btn>
        </v-card-actions>
    </v-card>
    
    <v-card 
    class="pa-3"
    v-else
    >
    <v-card-title class="text-h3">Batalkan Perubahan?</v-card-title>
    <v-card-text 
      class="text-subtitle-1 text-medium-emphasis"
      >
      Perubahan belum disimpan. Apakah Anda yakin ingin menutup tanpa menyimpan?
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="showConfirmDialog = false, pendingOverlayClose = false">Kembali</v-btn>
      <v-btn variant="elevated" color="error" @click="confirmCancel">Ya, Tutup</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>

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