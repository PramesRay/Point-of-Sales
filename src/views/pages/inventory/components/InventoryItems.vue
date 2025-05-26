<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { Category, InventoryItem, CreateInventoryItemPayload, UpdateInventoryItemPayload } from '@/types/inventory';

import { formatDate } from '@/utils/helpers/format-date';
import { useInventoryItems } from '@/composables/useInventoryItems';
import { cloneDeep } from 'lodash';
import { formatNumberInput } from '@/utils/helpers/format-input';

const { init: initItems, data: inventoryItem, categories: ctg, loading: li } = useInventoryItems();

onMounted(() => {
  initItems();
});

const emit = defineEmits<{
  (e: 'create-item', payload: CreateInventoryItemPayload): InventoryItem
  (e: 'update-item', payload: UpdateInventoryItemPayload): InventoryItem
}>();

const props = defineProps<{
  data: InventoryItem[];
  categories: Category[];
  loading: boolean;
}>();

const showOverlay = ref(false)
const formRef = ref()
const isFormValid = ref(false)

const selectedItem = ref<InventoryItem | null>(null)
const isNewItem = ref(false)
const adjustItem = ref<{
  name: string | null;
  description: string | null;
  quantity: number | null;
  category_id: string | null;
  expired_date: Date | null,
  unit: string | null,
  threshold: number | null
}>({
  name: null,
  description: null,
  quantity: 0,
  category_id: null,
  expired_date: null,
  unit: null,
  threshold: null
})
const datePickerMenu = ref(false)
const adjustmentNotes = ref('')
const selectedCtg = ref<string | null>('all')
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)

const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const descRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']
const qtyRules = [(v: number) => v > 0 || 'Jumlah harus lebih dari 0']

function openDetail(request: InventoryItem) {
  selectedItem.value = cloneDeep(request)
  isNewItem.value = false
  showOverlay.value = true
}

function openAddNew() {
  selectedItem.value = null
  isNewItem.value = true
  showOverlay.value = true

  adjustItem.value = {
    name: null,
    description: null,
    quantity: 0,
    category_id: null,
    expired_date: null,
    unit: null,
    threshold: null
  }
  adjustmentNotes.value = ''
}

const isChanged = computed(() => {
  if (!adjustItem.value) return false
  if (isNewItem.value) {
    return (
      adjustItem.value.name !== null ||
      adjustItem.value.description !== null ||
      adjustItem.value.quantity !== 0 ||
      adjustItem.value.category_id !== null ||
      adjustItem.value.expired_date !== null ||
      adjustmentNotes.value.trim() !== ''
    )
  } else {
    if (!selectedItem.value) return false
    return (
      adjustItem.value.name !== selectedItem.value.name ||
      adjustItem.value.description !== selectedItem.value.description ||
      adjustItem.value.quantity !== selectedItem.value.quantity ||
      adjustItem.value.category_id !== selectedItem.value.category?.id ||
      new Date(adjustItem.value.expired_date!).getTime() !== new Date(selectedItem.value.expired_date!).getTime() ||
      adjustmentNotes.value.trim() !== ''
    )
  }
})

const editableCategories = computed(() => props.categories)
const categories = computed(() => [{ id: 'all', name: 'Semua' }, ...props.categories])

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
  if (!adjustItem.value) return
  
  if (isNewItem.value) {
    const payload: CreateInventoryItemPayload = {
      name: adjustItem.value.name!,
      description: adjustItem.value.description!,
      quantity: adjustItem.value.quantity!,
      unit: adjustItem.value.unit!,
      threshold: adjustItem.value.threshold!,
      category_id: adjustItem.value.category_id!,
      expired_date: adjustItem.value.expired_date!,
      note: adjustmentNotes.value
    }
    console.log('Membuat item baru:', payload)
    emit('create-item', payload)
  } else {
    if (!selectedItem.value) return
    const payload: UpdateInventoryItemPayload = {
      id: selectedItem.value.id,
      name: adjustItem.value.name!,
      description: adjustItem.value.description!,
      quantity: adjustItem.value.quantity!,
      unit: adjustItem.value.unit!,
      threshold: adjustItem.value.threshold!,
      category_id: adjustItem.value.category_id!,
      expired_date: adjustItem.value.expired_date!,
      note: adjustmentNotes.value
    }
    console.log('Mengubah item:', payload)
    emit('update-item', payload)
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

  if (selectedItem.value) {
    adjustItem.value = {
      ...selectedItem.value,
      name: selectedItem.value.name ?? null,
      description: selectedItem.value.description ?? null,
      quantity: selectedItem.value.quantity ?? null,
      category_id: selectedItem.value.category?.id ?? null,
      expired_date: selectedItem.value.expired_date ?? null,
      unit: selectedItem.value.unit ?? null,
      threshold: selectedItem.value.threshold ?? null
    }
  }
  
  if (isNewItem.value) {
    adjustItem.value = {
      name: null,
      description: null,
      quantity: 0,
      category_id: null,
      expired_date: null,
      unit: null,
      threshold: null
    }
  }
  adjustmentNotes.value = ''
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
      category_id: val.category?.id ?? null,
      name: val.name,
      description: val.description ?? null,
      quantity: val.quantity ?? null,
      expired_date: val.expired_date ?? null,
      unit: val.unit ?? null,
      threshold: val.threshold ?? null
    }
    adjustmentNotes.value = ''
  }
})

watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
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
              :loading="loading"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <div class="mt-4" v-if="!loading">
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
                <span class="text-subtitle-2 text-disabled">
                  Expired: {{ item?.expired_date ? formatDate(new Date(item?.expired_date)) : 'Tidak ada kadaluarsa' }} 
                </span>
                <div class="d-flex justify-space-between align-start w-100">
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <h6
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
        <h4 class="text-h4 mt-1">{{ isNewItem ? 'Tambah Barang Baru' : 'Ubah Informasi Barang' }}</h4>
      </div>

      <v-divider class="my-3" />

      <v-form ref="formRef" v-model="isFormValid">
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="adjustItem.category_id"
              :items="editableCategories"
              item-title="name"
              item-value="id"
              label="Kategori"
              variant="underlined"
              :rules="requieredRules"
              prepend-icon="mdi-shape"
              single-line
            />
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="datePickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                  :model-value="adjustItem.expired_date ? formatDate(new Date(adjustItem.expired_date)) : ''"
                  v-bind="props"
                  label="Tanggal Expired"
                  variant="underlined"
                  prepend-icon="mdi-calendar"
                  :readonly="true"
                  :rules="requieredRules"
                  single-line
                />
              </template>
              <v-date-picker
                v-model="adjustItem.expired_date"
                @update:model-value="datePickerMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-row class="justify-space-between">
            <v-col cols="7">
              <v-combobox
                variant="underlined"
                v-model="adjustItem.name"
                :items="dataItems.map(item => ({ title: item.name, value: item.id }))"
                :loading="li"
                label="Nama Barang"
                :rules="requieredRules"
                prepend-icon="mdi-form-textbox"
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                type="number"
                hide-spin-buttons
                variant="underlined"
                v-model="adjustItem.threshold"
                label="Threshold"
                :min="0"
                :rules="[v => v > 0 || 'Threshold harus lebih dari 0']"
                prepend-icon="mdi-alert"
                @input="adjustItem.threshold = Number(formatNumberInput(String(adjustItem.threshold ?? 0)))"
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
                :rules="requieredRules"
                prepend-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="6" class="text-right">
              <v-number-input 
                control-variant="split"
                v-model.number="adjustItem.quantity"
                variant="plain"
                :min="0"
                :rules="qtyRules"
                style="max-width: 140px"
              ></v-number-input>
            </v-col>
          </v-row>

        <v-row class="text-caption text-medium-emphasis">
          <v-col>
            <v-textarea
              v-model="adjustItem.description"
              label="Deskripsi Barang: "
              :rules="descRules && requieredRules"
              variant="underlined"
              prepend-icon="mdi-text-box"
              rows="2"
              auto-grow
              clearable
              counter
            />
          </v-col>
        </v-row>

        <div>
          <div class="text-caption text-medium-emphasis">Catatan:</div>
          <v-textarea
            v-model="adjustmentNotes"
            :rules="descRules"
            label="Opsional"
            rows="3"
            auto-grow
            clear-icon="mdi-close"
            clearable
            counter
          />

          <v-divider class="my-3" />

          <div class="d-flex justify-end mt-1">
            <v-btn
              color="primary"
              :disabled="isNewItem ? !isFormValid : !isChanged"
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
    <v-card class="pa-3">
      <v-card-title class="text-h3">Batalkan Perubahan?</v-card-title>
      <v-card-text class="text-subtitle-1 text-medium-emphasis">
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