<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { Category, InventoryItem, CreateInventoryItemPayload, UpdateInventoryItemPayload } from '@/types/inventory';

import { useInventoryItems } from '@/composables/useInventoryItems';

import { formatNumberInput } from '@/utils/helpers/format-input';
import { getTimeDiff } from '@/utils/helpers/time';
import { formatRupiahInput } from '@/utils/helpers/currency';

const { init: initItems, data: inventoryItem, categories: ctg, loading: li } = useInventoryItems();

onMounted(() => {
  initItems();
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
}>();

const showOverlay = ref(false)
const formRef = ref()
const isFormValid = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)

const selectedItem = ref<InventoryItem | null>(null)
const adjustItem = ref<{[K in keyof Omit<InventoryItem, 'meta'>]: InventoryItem[K] | null}>({
  id: null,
  name: null,
  description: null,
  category: null,
  purchase_price: null,
  threshold: null,
  expired_date: null,
  quantity: null,
  unit: null
})
const selectedCtg = ref<string | null>('all')
const action = ref<'create' | 'update' | 'delete' | null>(null)
const inputCurrency = ref('')

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
    adjustItem.value = {
      ...selectedItem.value,
      name: selectedItem.value.name ?? null,
      description: selectedItem.value.description ?? null,
      category: selectedItem.value.category ?? null,
      purchase_price: selectedItem.value.purchase_price ?? null,
      threshold: selectedItem.value.threshold ?? null,
      expired_date: selectedItem.value.expired_date ?? null,
      quantity: selectedItem.value.quantity ?? null,
      unit: selectedItem.value.unit ?? null
    }
  } else if (action.value === 'create') {
    adjustItem.value = {
      id: null,
      name: null,
      description: null,
      category: null,
      purchase_price: null,
      threshold: null,
      expired_date: null,
      quantity: null,
      unit: null
    }
  }
  inputCurrency.value = ''
}

function openAddNew() {
  selectedItem.value = null
  action.value = 'create'
  clearPayload()

  adjustItem.value.category = { id: 'new', name: 'Baru' }

  showOverlay.value = true
}

function openDetail(request: InventoryItem) {
  selectedItem.value = cloneDeep(request)
  action.value = 'update'
  showOverlay.value = true

  console.log('selectedItem.value', selectedItem.value)
}

const isChanged = computed(() => {
  if (!adjustItem.value || !selectedItem.value) return false
  if (action.value === 'create') {
    return (
      adjustItem.value.name !== null ||
      adjustItem.value.description !== null ||
      adjustItem.value.purchase_price !== 0 ||
      adjustItem.value.unit !== null ||
      adjustItem.value.threshold !== 0
  )} else if (action.value === 'update') {
    return (
      adjustItem.value.name !== selectedItem.value.name ||
      adjustItem.value.description !== selectedItem.value.description ||
      adjustItem.value.threshold !== selectedItem.value.threshold ||
      adjustItem.value.purchase_price !== selectedItem.value.purchase_price ||
      adjustItem.value.category?.id !== selectedItem.value.category?.id ||
      adjustItem.value.expired_date !== selectedItem.value.expired_date ||
      adjustItem.value.quantity !== selectedItem.value.quantity ||
      adjustItem.value.unit !== selectedItem.value.unit
    )
  }
})

const editableCategories = computed(() => [{ id: 'new', name: 'Baru' }, ...props.categories])
const categories = computed(() => [{ id: 'all', name: 'Semua' }, { id: 'new', name: 'Baru' } , ...props.categories])

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.category?.id === selectedCtg.value)
})

const dataItems = computed(() => {
  if (!inventoryItem.value) return []
  return inventoryItem.value
})

function processAdjustment() {
  if (!adjustItem.value || !selectedItem.value) return

  const payload: CreateInventoryItemPayload = {
    name: adjustItem.value.name!,
    description: adjustItem.value.description!,
    category_id: adjustItem.value.category?.id!,
    purchase_price: adjustItem.value.purchase_price!,
    threshold: adjustItem.value.threshold!
  }

  if (action.value === 'delete') {
    console.log('Menghapus item:', selectedItem.value)
    emit('delete-item', selectedItem.value.id)
  } else if (action.value === 'create') {
    console.log('Membuat item baru:', payload)
    emit('create-item', payload)
  } else if (action.value === 'update') {
    const updatePayload: UpdateInventoryItemPayload = {
      id: adjustItem.value.id!,
      ...payload
    }
    console.log('Mengubah item:', updatePayload)
    emit('update-item', updatePayload)
  }
  
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processAdjustment()
  })
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false
  action.value = null
  
  clearPayload()
}

watch(
  () => props.categories,
  (newCategories) => {
    if (newCategories?.length && !selectedCtg.value) {
      selectedCtg.value = newCategories[0].id
    }
  },
  { immediate: true }
)

watch(selectedItem, (val) => {
  if (val) {
    adjustItem.value = {
      ...val,
      name: val.name,
      description: val.description ?? null,
      purchase_price: val.purchase_price ?? null,
      threshold: val.threshold ?? 0,
      category: val.category ?? null,
      expired_date: val.expired_date ?? null,
      quantity: val.quantity ?? null,
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
  adjustItem.value.purchase_price = numeric ? Number(numeric) : 0
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <h4 class="text-h4 mt-1">Stok Gudang</h4>
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
        </v-row>
        <v-row>
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
              :loading="props.loading"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <div class="mt-4" v-if="!props.loading">
          <perfect-scrollbar :style="{ maxHeight: mdAndUp? '15rem' : '12rem'}">
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
                  class="text-subtitle-2 text-disabled"
                  :class="{
                    'text-error': getTimeDiff(item?.expired_date) === 'sekarang' || getTimeDiff(item?.expired_date).includes('lalu'),
                    'text-warning': getTimeDiff(item?.expired_date) === '1 hari lagi'
                  }"
                >
                  {{ getTimeDiff(item?.expired_date) === 'sekarang' || getTimeDiff(item?.expired_date).includes('lalu') ? 'Sudah expired' : 'Exp: ' + getTimeDiff(item?.expired_date) }}
                </span>
                <div 
                  class="d-flex justify-space-between align-start w-100">
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <h6
                      :class="{'text-disabled': getTimeDiff(item?.expired_date) === 'sekarang' || getTimeDiff(item?.expired_date).includes('lalu')}"
                      class="text-h4 text-medium-emphasis font-weight-bold"
                      style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    >
                      {{ item?.name }}
                    </h6>
                    <i class="text-subtitle-2 text-disabled">
                      {{ item?.description }}
                    </i>
                  </div>

                  <!-- Kolom kanan -->
                  <div class="text-right min-w-[120px]">
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
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/inventory-items">
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

      <v-form ref="formRef" v-model="isFormValid">
        
        <v-row class="justify-center">
          <v-col cols="6">
            <v-text-field
              variant="underlined"
              v-model="adjustItem.name"
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
            <v-col cols="6">
              <v-combobox
                variant="underlined"
                v-model="adjustItem.unit"
                :items="['pcs', 'kg', 'ltr', 'box']"
                label="Satuan"
                :rules="rules.required_text"
                prepend-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="6">
              <v-number-input
                control-variant="split"
                inset
                variant="plain"
                v-model="adjustItem.threshold"
                label="Threshold"
                :min="0"
                :rules="rules.required_number"
                prepend-icon="mdi-alert"
              />
            </v-col>
          </v-row>

        <v-row class="text-caption text-medium-emphasis">
          <v-col>
            <v-textarea
              v-model="adjustItem.description"
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
              v-if="action === 'update'"
              icon
              variant="text"
              class="mr-1 text-error"
              density="compact"
              @click="pendingOverlayClose = true, action = 'delete', showConfirmDialog = true"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <!-- vertical divider -->
            <v-divider v-if="action === 'update'" vertical inset/>
            
            <v-btn
              class="ms-2"
              color="primary"
              :disabled="!isFormValid"
              :loading="props.loading"
              @click="submitForm"
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
          <v-btn variant="elevated" color="error" @click="action = 'delete', processAdjustment">Ya, Hapus</v-btn>
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

</style>