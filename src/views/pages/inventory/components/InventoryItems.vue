<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { InventoryCategory, InventoryItem } from '@/types/inventoryItem';
import { formatDate } from '@/utils/helpers/format-date';

const props = defineProps<{
  data: InventoryItem[];
  categories: InventoryCategory[];
  loading: boolean;
}>();

const selectedItem = ref<InventoryItem | null>(null)
const showOverlay = ref(false)
const adjustItem = ref({
  name: '',
  description: '',
  quantity: 0,
  categoryId: ''
})
const adjustmentNotes = ref('')
const dataEdited = ref<Boolean>(false)

function openDetail(request: InventoryItem) {
  selectedItem.value = request
  showOverlay.value = true
}

const isChanged = computed(() => {
  if (!adjustItem.value || !selectedItem.value) return false

  return (
    adjustItem.value.name !== selectedItem.value.name ||
    adjustItem.value.description !== selectedItem.value.description ||
    adjustItem.value.quantity !== selectedItem.value.quantity ||
    adjustItem.value.categoryId !== selectedItem.value.category?.id ||
    adjustmentNotes.value.trim() !== ''
  )
})


const nameRules = [(v: string) => !!v || 'Nama tidak boleh kosong']
const descRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']

// Tambahkan computed category list (tanpa "all" untuk select)
const editableCategories = computed(() => props.categories)

const categories = computed(() => [
  {id: 'all', name: 'Semua'},
  ...props.categories
])

const selectedCtg = ref<string | null>('all')

function processAdjustment() {
  if (!adjustItem.value) return

  const payload = {
    id: selectedItem.value?.id,
    adjustmentNotes: adjustmentNotes.value,
    name: adjustItem.value.name,
    description: adjustItem.value.description,
    quantity: adjustItem.value.quantity,
    categoryId: adjustItem.value.categoryId
  }

  console.log('Mengirim ke backend:', payload)
  showOverlay.value = false
}

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.category?.id === selectedCtg.value)
})

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

// saat overlay terbuka, clone item untuk keperluan adjustment
watch(selectedItem, (val) => {
  if (val) {
    adjustItem.value = {
      ...val,
      categoryId: val.category?.id ?? null,
      name: val.name,
      description: val.description,
      quantity: val.quantity
    }
    adjustmentNotes.value = ''
  }
})

const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay

function confirmCancel() {
  showConfirmDialog.value = false
  showOverlay.value = false
  pendingOverlayClose.value = false

  if (selectedItem.value) {
    adjustItem.value = {
      ...selectedItem.value,
      categoryId: selectedItem.value.category?.id ?? null,
    }
    adjustmentNotes.value = ''
  }
}

watch(showOverlay, (isOpen, wasOpen) => {
  // Jika overlay akan ditutup dan ada perubahan, tampilkan dialog konfirmasi
  if (!isOpen && wasOpen && isChanged.value) {
    pendingOverlayClose.value = true
    showConfirmDialog.value = true
    showOverlay.value = true // cegah overlay langsung menutup
    return
  }

  // Jika overlay benar-benar ditutup tanpa perubahan
  if (!isOpen && selectedItem.value) {
    adjustItem.value = {
      ...selectedItem.value,
      categoryId: selectedItem.value.category?.id ?? null,
      name: selectedItem.value.name,
      description: selectedItem.value.description,
      quantity: selectedItem.value.quantity
    }
    adjustmentNotes.value = ''
  }
})

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <h4 class="text-h4 mt-1">Stok Gudang</h4>
          </v-col>
          <v-col cols="12" sm="6">
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
    <v-card
      class="rounded-lg pa-6 mt-8 bg-white"
      style="width: 90vw; max-width: 90vw;"
    >
      <!-- Close button -->
      <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="d-flex align-center">
        <h4 class="text-h4 mt-1">Perubahan Jumlah Stok</h4>
      </div>

      <div class="py-3">
        <span>
          <v-select
            v-model="adjustItem.categoryId"
            :items="editableCategories"
            item-title="name"
            item-value="id"
            label="Kategori"
            variant="plain"
            class="custom-select text-subtitle-2 text-medium-emphasis font-weight-medium w-50"
            density="compact"
            hide-details
            single-line
          />
        </span>
        <v-row class="d-inline-flex align-center justify-space-between w-100">
          <v-col cols="6">
            <v-text-field
              v-model="adjustItem.name"
              label="Nama Barang"
              :rules="nameRules"
              class="text-secondary font-weight-bold"
              variant="plain"
              hide-details
              single-line
            />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-number-input 
              control-variant="split"
              v-model.number="adjustItem.quantity"
              variant="plain"
              hide-details
              :min="0"
              style="max-width: 140px"
            ></v-number-input>
          </v-col>
        </v-row>
        <div class="text-caption text-medium-emphasis">
            Deskripsi: 
            <div>
              <v-text-field
                v-model="adjustItem.description"
                label="Deskripsi Barang"
                :rules="descRules"
                variant="plain"
                class="font-italic"
                hide-details
                single-line
            />
            </div>
          </div>
      </div>
      
      <div>
        <!-- Input catatan tambahan -->
        <div class="text-caption text-medium-emphasis">
          Catatan: 
        </div>
        <v-textarea
          v-model="adjustmentNotes"
          :rules="notesRules"
          label="Opsional"
          rows="2"
          auto-grow
          clear-icon="mdi-close"
          clearable
          counter
        />

        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn 
            color="primary" 
            @click="processAdjustment"
            :disabled="!isChanged"
          >
            Simpan
          </v-btn>
        </div>
      </div>
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
        <v-btn variant="text" @click="showConfirmDialog = false">Kembali</v-btn>
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