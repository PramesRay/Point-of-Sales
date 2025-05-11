<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { InventoryCategory, StockMovement } from '@/types/inventoryItem';
import type { Branch } from '@/types/branch';
import { formatDate } from '@/utils/helpers/format-date';

const props = defineProps<{
  data: StockMovement[];
  categories: InventoryCategory[];
  branches: Branch[];
  loading: boolean;
}>();

const formRef = ref()
const isFormValid = ref(false)


const datePickerMenu = ref(false)
const isManuallySaving = ref(false)

const showOverlay = ref(false)
const createMovement = ref({
  name: null,
  description: null,
  quantity: 0,
  unit: null,
  categoryId: null,
  status: null,
  time: null,
  branchId: null
})

const branches = computed(() => props.branches)
const selectedBranch = ref<string>()

const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const qtyRules = [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0']
const descRules = [((v: string) => v.length <= 100 || 'Maks 100 karakter'), ((v: string) => !!v || 'Deskripsi tidak boleh kosong')]

const statusMovement = ['Masuk', 'Keluar']

// Tambahkan computed category list (tanpa "all" untuk select)
const editableCategories = computed(() => props.categories)

const categories = computed(() => [
  {id: 'all', name: 'Semua'},
  ...props.categories
])

const selectedCtg = ref<string | null>('all')

function processCreateMovement() {
  if (!createMovement.value) return

  const payload = {
    name: createMovement.value.name,
    description: createMovement.value.description,
    quantity: createMovement.value.quantity,
    unit: createMovement.value.unit,
    categoryId: createMovement.value.categoryId,
    status: createMovement.value.status,
    time: createMovement.value.time ? new Date(createMovement.value.time).toISOString() : null,
    branchId: createMovement.value.branchId
  }

  console.log('Mengirim ke backend:', payload)
  isManuallySaving.value = true
  showOverlay.value = false

  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processCreateMovement()
  })
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

const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay

function confirmCancel() {
  showConfirmDialog.value = false
  showOverlay.value = false
  pendingOverlayClose.value = false

  if (createMovement.value) {
    createMovement.value = {
      name: null,
      description: null,
      quantity: 0,
      unit: null,
      categoryId: null,
      status: null,
      time: null,
      branchId: null
    }
  }
}

const isChanged = computed(() => {
  if (!createMovement.value) return false

  return (
    createMovement.value.name !== null ||
    createMovement.value.description !== null ||
    createMovement.value.quantity !== 0 ||
    createMovement.value.categoryId !== null ||
    createMovement.value.status !== null ||
    createMovement.value.time !== null
  )
})

watch(showOverlay, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) {
    if (isManuallySaving.value) {
      isManuallySaving.value = false
      return // tidak tampilkan confirm dialog
    }
    if (isChanged.value) {
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
      showOverlay.value = true
    }
  }
})


</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row class="justify-space-between">
          <v-col cols="6" sm="3">
            <h4 class="text-h4 mt-1">Perpindahan Stok</h4>
          </v-col>
          <v-col cols="4" sm="3">
            <v-btn
              color="primary"
              @click="showOverlay = true"
            >
              Tambah
            </v-btn>
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
              >
                <span class="text-subtitle-2 text-medium-emphasis">
                  <i> {{ item?.quantity != null && item?.unit ? `${item.quantity} ${item.unit}` : '-' }} </i>
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
                      v-if="item?.quantity >= 0"
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
    class="d-flex justify-center align-start"
  >
    <v-card
      class="rounded-lg pa-6 mt-8 bg-white "
      style="width: 90vw; max-width: 90vw;"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <!-- Close button -->
        <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Buat Perpindahan Stok</h4>
        </div>
        <v-divider class="my-3" />

        <div>
          <v-row>
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="createMovement.categoryId"
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
                    :model-value="createMovement.time ? formatDate(new Date(createMovement.time)) : ''"
                    v-bind="props"
                    label="Tanggal Perpindahan"
                    variant="underlined"
                    prepend-icon="mdi-calendar"
                    :readonly="true"
                    :rules="requieredRules"
                  />
                </template>
                <v-date-picker
                  v-model="createMovement.time"
                  @update:model-value="datePickerMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="justify-space-between">
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="createMovement.status"
                :items="statusMovement"
                :rules="requieredRules"
                label="Kategori"
                prepend-icon="mdi-home"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="selectedBranch"
                label="Cabang"
                :items="branches"
                :rules="requieredRules"
                item-title="name"
                item-value="id"
                prepend-icon="mdi-format-vertical-align-center"
              />
            </v-col>
          </v-row>

          <v-row class="justify-space-between">
            <v-col cols="12">
              <v-text-field
                variant="underlined"
                v-model="createMovement.name"
                label="Nama Barang"
                :rules="requieredRules"
                prepend-icon="mdi-form-textbox"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                variant="underlined"
                v-model="createMovement.unit"
                label="Satuan"
                :rules="requieredRules"
                prepend-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="6" class="text-right">
              <v-number-input 
                control-variant="split"
                v-model.number="createMovement.quantity"
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
              v-model="createMovement.description"
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
        <v-btn variant="text" @click="showConfirmDialog = false">Kembali</v-btn>
        <v-btn variant="elevated" color="error" @click="confirmCancel">Ya, Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>