<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { Category, StockMovement, CreateStockMovementPayload, UpdateStockMovementPayload } from '@/types/inventory';
import type { Branch } from '@/types/branch';

import { formatDate } from '@/utils/helpers/format-date';
import { useInventoryItems } from '@/composables/useInventoryItems';

const { init: initItems, data: inventoryItem, categories: ctg, loading: li } = useInventoryItems();

onMounted(() => {
  initItems();
});

const emit = defineEmits<{
  (e: 'create-sm', payload: CreateStockMovementPayload): StockMovement
  (e: 'update-sm', payload: CreateStockMovementPayload): StockMovement
}>();

const props = defineProps<{
  data: StockMovement[];
  categories: Category[];
  branches: Branch[];
  loading: boolean;
}>();

const branches = computed(() => props.branches)
const editableCategories = computed(() => props.categories)
const categories = computed(() => [
  {id: 'all', name: 'Semua'},
  ...props.categories
])
const dataItems = computed(() => {
  if (!inventoryItem.value) return []
  return inventoryItem.value
})

const selectedCtg = ref<string | null>('all')
const selectedItem = ref<StockMovement | null>(null)

const formRef = ref()
const isFormValid = ref(false)
const datePickerMenu = ref(false)

const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)
const showOverlay = ref(false)
const isManuallySaving = ref(false)

const isNewItem = ref(false)
const statusMovement = ref(['Keluar', 'Masuk'])

// Payload
const dataMovement = ref<{
  name: string | null,
  description: string | null,
  quantity: number | 0,
  unit: string | null,
  categoryId: string | null,
  time: Date | null,
  branchId: string | null,
  status: string | null
}>({
  name: null,
  description: null,
  quantity: 0,
  unit: null,
  categoryId: null,
  time: null,
  branchId: null,
  status: null
})

// Form Rules
const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const qtyRules = [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0']
const descRules = [((v: string) => v.length <= 100 || 'Maks 100 karakter'), ((v: string) => !!v || 'Deskripsi tidak boleh kosong')]

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.category?.id === selectedCtg.value)
})

const isChanged = computed(() => {
  if (!dataMovement.value) return false

  if (isNewItem.value) {
    return (
      dataMovement.value.name !== null ||
      dataMovement.value.description !== null ||
      dataMovement.value.branchId !== null ||
      dataMovement.value.unit !== null ||
      dataMovement.value.quantity !== 0 ||
      dataMovement.value.categoryId !== null ||
      dataMovement.value.status !== null ||
      dataMovement.value.time !== null
    )
  } else {
    if (!selectedItem.value) return false
    return (
      dataMovement.value.name !== selectedItem.value.name ||
      dataMovement.value.description !== selectedItem.value.description ||
      dataMovement.value.unit !== selectedItem.value.unit ||
      dataMovement.value.branchId !== selectedItem.value.branch?.id ||
      dataMovement.value.quantity !== selectedItem.value.quantity ||
      dataMovement.value.categoryId !== selectedItem.value.category?.id ||
      dataMovement.value.status !== selectedItem.value.status ||
      new Date(dataMovement.value.time!).getTime() !== new Date(selectedItem.value.time!).getTime()
    )
  }
})

function clearPayload() {
  dataMovement.value = {
    name: null,
    description: null,
    quantity: 0,
    unit: null,
    categoryId: null,
    time: null,
    branchId: null,
    status: null
  }
}

function openDetail(request: StockMovement) {
  selectedItem.value = cloneDeep(request)
  isNewItem.value = false
  showOverlay.value = true
}

function openAddNew() {
  selectedItem.value = null
  isNewItem.value = true
  showOverlay.value = true
}

function processdataMovement() {
  if (!dataMovement.value) return

  const payload = {
    name: dataMovement.value.name!,
    description: dataMovement.value.description!,
    quantity: dataMovement.value.quantity!,
    unit: dataMovement.value.unit!,
    category_id: dataMovement.value.categoryId!,
    time: dataMovement.value.time ? new Date(dataMovement.value.time) : undefined,
    branch_id: dataMovement.value.branchId! 
  }

  const updatePayload: UpdateStockMovementPayload = {
    id: selectedItem.value?.id!,
    ...payload
  }

  if (isNewItem.value) {
    emit('create-sm', payload)
    console.log('Membuat item baru:', payload)
  } else {
    emit('update-sm', updatePayload)
    console.log('Mengubah item:', updatePayload)
  }
  
  isManuallySaving.value = true
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processdataMovement()
  })
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  if (selectedItem.value) {
    dataMovement.value = {
      name: selectedItem.value.name ?? null,
      description: selectedItem.value.description ?? null,
      quantity: selectedItem.value.quantity ?? 0,
      unit: selectedItem.value.unit ?? null,
      categoryId: selectedItem.value.category?.id ?? null,
      time: selectedItem.value.time ?? null,
      branchId: selectedItem.value.branch?.id ?? null,
      status: selectedItem.value.status ?? null
    }
  } else {
    clearPayload()
  }
}

// Watcher: Set default selected category setelah data categories tersedia
watch(
  () => props.categories,
  (newCategories) => {
    if (newCategories?.length && !selectedCtg.value) {
      selectedCtg.value = newCategories[0].id
    }
  },
  { immediate: true } // agar langsung jalan saat mounted juga
)

watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (isManuallySaving.value) {
      // 👇 Reset dan biarkan overlay benar-benar tertutup
      isManuallySaving.value = false
      return
    }

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

watch(selectedItem, (val) => {
  if (val) {
    dataMovement.value = {
      name: val.name ?? null,
      description: val.description ?? null,
      quantity: val.quantity ?? 0,
      unit: val.unit ?? null,
      categoryId: val.category?.id ?? null,
      time: val.time ?? null,
      branchId: val.branch?.id ?? null,
      status: val.status ?? null
    }
  }
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row class="justify-space-between">
          <v-col cols="6" >
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
          <v-col cols="12" class="pt-0 py-2">
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
          <perfect-scrollbar :style="{ maxHeight: mdAndUp? '17rem' : '12rem'}">
            <v-list v-if="currentData.length > 0" class="py-0">
              <v-list-item
                v-for="(item, i) in currentData"
                :key="i"
                :value="item"
                color="secondary"
                rounded="sm"
                @click="openDetail(item)"
              >
                <span class="text-subtitle-2 text-medium-emphasis">
                  <span> {{ item?.quantity != null && item?.unit ? `${item.quantity} ${item.unit}` : '-' }} <i class="text-disabled">: {{ item?.branch?.name }}</i> </span>
                </span>

                <div class="d-flex justify-space-between align-start w-100" >
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <h6
                      class="text-h4 text-medium-emphasis font-weight-bold"
                      style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    >
                      {{ item?.name }}
                    </h6>
                    <i class="text-subtitle-2 text-disabled">
                      {{ item.time ? formatDate(new Date(item?.time)) : '-' }}
                    </i>
                  </div>

                  <!-- Kolom kanan -->
                  <div class="text-right min-w-[120px]">
                    <div class="d-flex justify-end">
                      <span 
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="{
                          'text-success': item?.status === 'Masuk',
                          'text-error': item?.status === 'Keluar'                        
                        }"
                      >
                        {{ item?.status }}
                      </span>
                    </div>
                    <div
                      v-if="item?.quantity! >= 0"
                      class="text-subtitle-1 text-medium-emphasis font-weight-bold my-1"
                    >
                      {{ item?.quantity != null && item?.unit ? `${item.quantity} ${item.unit}` : '-' }}
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
      class="rounded-lg pa-6 mt-8 bg-white "
      style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;" 
    >
      <v-form ref="formRef" v-model="isFormValid">
        <!-- Close button -->
        <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">{{ isNewItem ? 'Buat Perpindahan Stok' : 'Ubah Perpindahan Stok'}}</h4>
        </div>
        <v-divider class="my-3" />

        <div>
          <v-row>
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="dataMovement.categoryId"
                :items="editableCategories"
                :rules="requieredRules"
                item-title="name"
                item-value="id"
                label="Kategori"
                prepend-icon="mdi-shape"
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
                    :model-value="dataMovement.time ? formatDate(new Date(dataMovement.time)) : ''"
                    v-bind="props"
                    label="Tanggal Perpindahan"
                    variant="underlined"
                    prepend-icon="mdi-calendar"
                    :readonly="true"
                    :rules="requieredRules"
                  />
                </template>
                <v-date-picker
                  v-model="dataMovement.time"
                  @update:model-value="datePickerMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="justify-space-between">
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="dataMovement.status"
                :items="statusMovement"
                :rules="requieredRules"
                label="Kategori"
                prepend-icon="mdi-format-vertical-align-center"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="dataMovement.branchId"
                label="Cabang"
                :items="branches"
                :rules="requieredRules"
                item-title="name"
                item-value="id"
                prepend-icon="mdi-home"
              />
            </v-col>
          </v-row>

          <v-row class="justify-space-between">
            <v-col cols="12">
              <v-combobox
                variant="underlined"
                v-model="dataMovement.name"
                :items="dataItems.map(item => ({ title: item.name, value: item.id }))"
                label="Nama Barang"
                :rules="requieredRules"
                prepend-icon="mdi-form-textbox"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-combobox
                variant="underlined"
                v-model="dataMovement.unit"
                :items="['pcs', 'kg', 'ltr', 'box']"
                label="Satuan"
                :rules="requieredRules"
                prepend-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="6" class="text-right">
              <v-number-input 
                control-variant="split"
                v-model.number="dataMovement.quantity"
                variant="plain"
                :min="0"
                :rules="qtyRules"
                style="max-width: 140px"
              ></v-number-input>
            </v-col>
          </v-row>

          <div >
            <v-textarea
              variant="underlined"
              v-model="dataMovement.description"
              :rules="descRules"
              label="Deskripsi"
              rows="2"
              auto-grow
              prepend-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </div>
        </div>

        <v-divider class="my-3" />
      
        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn
            color="primary"
            :disabled="!isFormValid || !isChanged"
            @click="submitForm"
          >
            Simpan
          </v-btn>
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