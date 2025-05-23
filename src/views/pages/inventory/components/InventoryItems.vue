<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Category, InventoryItem } from '@/types/inventoryItem';
import { formatDate } from '@/utils/helpers/format-date';

const props = defineProps<{
  data: InventoryItem[];
  categories: Category[];
  loading: boolean;
}>();

const selectedItem = ref<InventoryItem | null>(null)
const showOverlay = ref(false)
const formRef = ref()
const isFormValid = ref(false)
const isNewItem = ref(false)
const adjustItem = ref<{
  name: string | null;
  description: string | null;
  quantity: number | null;
  categoryId: string | null;
  expireDate: Date | null
}>({
  name: null,
  description: null,
  quantity: 0,
  categoryId: null,
  expireDate: null
})
const datePickerMenu = ref(false)
const adjustmentNotes = ref('')
const selectedCtg = ref<string | null>('all')
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)

const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const descRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']
const qtyRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

function openDetail(request: InventoryItem) {
  selectedItem.value = request
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
    categoryId: null,
    expireDate: null
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
      adjustItem.value.categoryId !== null ||
      adjustItem.value.expireDate !== null ||
      adjustmentNotes.value.trim() !== ''
    )
  } else {
    if (!selectedItem.value) return false
    return (
      adjustItem.value.name !== selectedItem.value.name ||
      adjustItem.value.description !== selectedItem.value.description ||
      adjustItem.value.quantity !== selectedItem.value.quantity ||
      adjustItem.value.categoryId !== selectedItem.value.category?.id ||
      new Date(adjustItem.value.expireDate!).getTime() !== new Date(selectedItem.value.expireDate!).getTime() ||
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

function processAdjustment() {
  if (!adjustItem.value) return

  const payload = {
    id: selectedItem.value?.id,
    name: adjustItem.value.name,
    description: adjustItem.value.description,
    quantity: adjustItem.value.quantity,
    categoryId: adjustItem.value.categoryId,
    expiredDate: adjustItem.value.expireDate,
    adjustmentNotes: adjustmentNotes.value
  }

  if (isNewItem.value) {
    console.log('Membuat item baru:', payload)
  } else {
    console.log('Mengubah item:', payload)
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
      categoryId: selectedItem.value.category?.id ?? null,
      expireDate: selectedItem.value.expireDate ?? null
    }
  }
  
  if (isNewItem.value) {
    adjustItem.value = {
      name: null,
      description: null,
      quantity: 0,
      categoryId: null,
      expireDate: null
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
      categoryId: val.category?.id ?? null,
      name: val.name,
      description: val.description ?? null,
      quantity: val.quantity ?? null,
      expireDate: val.expireDate ?? null
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
          <v-col cols="8" sm="6">
            <h4 class="text-h4 mt-1">Stok Gudang</h4>
          </v-col>
          <v-col cols="4" sm="3" class="mt-auto">
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
          <perfect-scrollbar v-bind:style="{ height: '180px' }">
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
                  <i> Expired: {{ formatDate(new Date(item?.expireDate)) }} </i>
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
                    <i class="text-subtitle-2 text-medium-emphasis">
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
    class="d-flex justify-center align-start"
  >
    <v-card class="rounded-lg pa-6 mt-8 bg-white" style="width: 90vw; max-width: 90vw;">
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
              v-model="adjustItem.categoryId"
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
                  :model-value="adjustItem.expireDate ? formatDate(new Date(adjustItem.expireDate)) : ''"
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
                v-model="adjustItem.expireDate"
                @update:model-value="datePickerMenu = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="adjustItem.name"
              label="Nama Barang"
              :rules="requieredRules"
              variant="underlined"
              prepend-icon="mdi-form-textbox"
              single-line
            />
          </v-col>
          <v-col cols="6">
            <v-number-input
              control-variant="split"
              v-model.number="adjustItem.quantity"
              variant="plain"
              :min="0"
              style="max-width: 140px"
            />
          </v-col>
        </v-row>

        <v-row class="text-caption text-medium-emphasis">
          <v-col>
            <v-text-field
              v-model="adjustItem.description"
              label="Deskripsi Barang: "
              :rules="descRules"
              variant="underlined"
              prepend-icon="mdi-text-box"
            />
          </v-col>
        </v-row>

        <div>
          <div class="text-caption text-medium-emphasis">Catatan:</div>
          <v-textarea
            v-model="adjustmentNotes"
            :rules="descRules"
            label="Opsional"
            rows="2"
            auto-grow
            clear-icon="mdi-close"
            clearable
            counter
          />

          <v-divider class="my-3" />

          <div class="d-flex justify-end mt-1">
            <v-btn
              color="primary"
              :disabled="!isFormValid || !isChanged"
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