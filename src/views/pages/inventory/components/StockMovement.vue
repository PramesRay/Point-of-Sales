<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { Category, StockMovement, CreateStockMovementPayload, UpdateStockMovementPayload } from '@/types/inventory';
import type { Branch } from '@/types/branch';

import { formatDate } from '@/utils/helpers/format-date';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

import { useInventoryItems } from '@/composables/useInventoryItems';
import { useUserStore } from '@/stores/authUser';
const userStore = useUserStore();

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

const editableCategories = computed(() => props.categories.filter(ctg => ctg.id !== 'new'))
const categories = computed(() => [
  {id: 'all', name: 'Semua'},
  ...props.categories
])


const dataItems = computed(() => {
  if (!inventoryItem.value) return []
  return inventoryItem.value.map(item => {
    const newItem = { ...item }
    if (newItem.category?.id === 'new') {
      newItem.name += ' (Baru)'
    }
    return newItem
  })

})

const selectedCtg = ref<string | null>('all')
const selectedItem = ref<StockMovement | null>(null)

const formRef = ref()
const isFormValid = ref(false)
const datePickerMenuExp = ref(false)
const dateMenu = ref(false)
const dateModel = ref<Date | null>(null);
const timeMenu = ref(false)
const timeModel = ref<string>('');
const isUpdatingTime = ref(false)
const isNewItem = ref(false)
const unit = ref('')

const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)
const showOverlay = ref(false)
const isManuallySaving = ref(false)

// Payload
const payload = ref<{
  description: string | null,
  branch_id: string,
  status: string | null,
  time: Date,
  item: {
    id: string | null,
    category_id: string | null,
    quantity: number
  }
}>({
  description: null,
  branch_id: userStore.me!.assigned_branch![0].id,
  status: null,
  time: new Date(),
  item: {
    id: null,
    category_id: null,
    quantity: 0
  }
})

// Form Rules
const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosong'],
  item_required: [(v: number) => payload.value.item.id !== null && payload.value.item.id !== "" || 'Pilih item terlebih dahulu'],
  status_required: [(v: string) => payload.value.status !== null && payload.value.status !== "" || 'Pilih status terlebih dahulu'],
  qty: [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0'],
  desc: [(v: string) => v.length <= 100 || 'Maksimal 100 karakter'],
}

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.item.category?.id === selectedCtg.value)
})

const isChanged = computed(() => {
  if (!payload.value) return false

  if (isNewItem.value) {
    return (
      payload.value.description !== null ||
      payload.value.status !== null ||
      payload.value.branch_id !== null ||
      payload.value.time !== null ||
      payload.value.item.id !== null ||
      payload.value.item.category_id !== null ||
      payload.value.item.quantity !== 0
    )
  } else {
    if (!selectedItem.value) return false
    return (
      payload.value.description !== selectedItem.value.description ||
      payload.value.status !== selectedItem.value.status ||
      payload.value.branch_id !== selectedItem.value.branch.id ||
      payload.value.time !== selectedItem.value.time ||
      payload.value.item.id !== selectedItem.value.item.id ||
      payload.value.item.category_id !== selectedItem.value.item.category?.id ||
      payload.value.item.quantity !== selectedItem.value.item.quantity
    )
  }
})

// Format Date untuk time dan exp
const formatedDateTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(0, -12)
})
const formatedClockTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(-5)
})

// Handler saat pilih tanggal
function onDatePicked(val: Date | null) {
  if (!val) return;

  if (!payload.value.time) payload.value.time = new Date()

  const time = payload.value.time

  payload.value.time = new Date(
    val.getFullYear(),
    val.getMonth(),
    val.getDate(),
    time.getHours(),
    time.getMinutes(),
    0
  )
  dateMenu.value = false
  setTimeout(() => {
    timeMenu.value = true
    isUpdatingTime.value = true
  } , 100)
}


function onTimePicked(val: string) {
  isUpdatingTime.value = true
  if (!payload.value.time) {
    payload.value.time = new Date()
  }

  const oldDate = payload.value.time
  const [hours, minutes] = val.split(':').map(Number) 
  payload.value.time = new Date(
    oldDate.getFullYear(),
    oldDate.getMonth(),
    oldDate.getDate(),
    hours,
    minutes,
    0
  )
  
  timeModel.value = ''
  timeMenu.value = false
}

function clearPayload() {
  payload.value = {
    description: null,
    branch_id: userStore.me!.assigned_branch![0].id,
    item: {
      id: null,
      category_id: null,
      quantity: 0
    },
    time: new Date(),
    status: null
  }

  timeModel.value = ''
  dateModel.value = null
  isUpdatingTime.value = false
}

function openDetail(request: StockMovement) {
  selectedItem.value = cloneDeep(request)
  isNewItem.value = false
  showOverlay.value = true
}

function openAddNew() {
  isNewItem.value = true
  showOverlay.value = true
  
  clearPayload()
}

function processdataMovement() {
  if (!payload.value) return
  console.log('data movement before', payload.value)

  if (isNewItem.value) {
    emit('create-sm', (payload.value as CreateStockMovementPayload))
    console.log('Membuat item baru:', payload.value)
  } else {
    const updatePayload: UpdateStockMovementPayload = {
      id: selectedItem.value?.id!,
      ...payload.value as CreateStockMovementPayload
    }
    emit('update-sm', (updatePayload))
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
    payload.value = {
      description: selectedItem.value.description ?? null,
      branch_id: selectedItem.value.branch.id ?? null,
      item: {
        id: selectedItem.value.item.id,
        category_id: selectedItem.value.item.category.id,
        quantity: selectedItem.value.item.quantity,
      },
      time: selectedItem.value.time ?? null,
      status: selectedItem.value.status ?? null,
    }
  } else {
    clearPayload()
  }
}

function updateItem(id: string) {
  if (id) {
    // Cari item berdasarkan id barang yang dipilih
    const item = dataItems.value.find(item => item.id === id)
    if (item) {
      unit.value = item.unit
      
      if (payload.value.item.category_id == 'new') {
        payload.value.item.category_id = ''
        alertStore.showAlert('Pilih Kategori untuk barang baru!', 'warning');
      }
    } else console.log('item not found')
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
    payload.value = {
      description: val.description ?? null,
      branch_id: val.branch.id ?? null,
      item: {
        id: val.item.id,
        category_id: val.item.category.id,
        quantity: val.item.quantity
      },
      time: val.time ?? null,
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

        <div class="mt-4" v-if="!props.loading">
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
              <i class="text-subtitle-2 text-disabled">
                {{ item.time ? formatDate(new Date(item?.time)).slice(0, -12)+': '+formatDate(new Date(item?.time)).slice(-5) : '-' }}
              </i>

                <div class="d-flex justify-space-between align-start w-100" >
                  <!-- Kolom kiri -->
                  <div class="pe-4" style="flex: 1">
                    <h6
                    class="text-h4 text-medium-emphasis font-weight-bold"
                    style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                    >
                    {{ item?.item.name }}
                  </h6>
                  <span class="text-subtitle-2 text-disabled">
                    {{ item?.branch?.name }}
                  </span>
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
                      v-if="item?.item.quantity! >= 0"
                      class="text-subtitle-1 text-medium-emphasis font-weight-bold my-1"
                    >
                      {{ item?.item.quantity != null && item?.item.unit ? `${item.item.quantity} ${item.item.unit}` : '-' }}
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
        
        <PerfectScrollbar :style="{ maxHeight: mdAndUp? '80dvh' : '70dvh'}">
          <div class="text-h4 text-disabled text-center mb-3">Informasi Perpindahan </div>
          <v-row no-gutters class="justify-center">
            <v-col cols="7">
              <v-text-field
                v-model="formatedDateTime"
                label="Tanggal"
                prepend-inner-icon="mdi-calendar"
                readonly
                :active="dateMenu"
                :focused="dateMenu"
                variant="underlined"
                :rules="rules.required"
              />
                <v-dialog
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                  offset-y
                  max-width="290"
                  min-width="290"
                >
                  <v-date-picker
                    v-model="dateModel"
                    @update:model-value="onDatePicked"
                    :max="new Date()"
                    no-title
                    scrollable
                  />
              </v-dialog>
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="formatedClockTime"
                label="Waktu"
                prepend-inner-icon="mdi-clock-outline"
                readonly
                :active="timeMenu"
                :focused="timeMenu"
                variant="underlined"
                :rules="rules.required"
              >
                <v-dialog
                  v-model="timeMenu"
                  activator="parent"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290"
                  min-width="290"
                >
                <!-- two digit hour in :min -->
                  <v-time-picker
                    v-model="timeModel"
                    format="24hr"
                    @update:model-value="onTimePicked"
                    :max="payload.time?.toLocaleDateString() === new Date().toLocaleDateString() ? new Date().toTimeString().slice(0, 5) : '23:59'"
                  />
                </v-dialog>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="justify-space-between">
            <v-col cols="6" class="pe-2">
              <v-select
                variant="underlined"
                v-model="payload.status"
                :items="['Masuk', 'Keluar', 'Penyesuaian']"
                :rules="rules.required"
                label="Tipe"
                prepend-inner-icon="mdi-format-vertical-align-center"
                @update:model-value="formRef.validate()"
              />
            </v-col>
            <v-col cols="6" class="ps-2">
              <v-select
                variant="underlined"
                v-model="payload.branch_id"
                label="Cabang"
                :items="userStore.me!.assigned_branch || []"
                :rules="rules.required"
                item-title="name"
                item-value="id"
                prepend-inner-icon="mdi-home"
              />
            </v-col>
          </v-row>
          
          <div>
            <v-textarea
              variant="underlined"
              v-model="payload.description"
              :rules="rules.desc && rules.required"
              label="Deskripsi"
              rows="2"
              auto-grow
              prepend-inner-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </div>
          
          <div class="text-h4 text-disabled text-center mb-3">Informasi Barang </div>

          <v-row no-gutters class="justify-space-between">
            <v-col cols="5" class="pe-2">
              <v-select
                variant="underlined"
                v-model="payload.item.category_id"
                :items="editableCategories"
                :rules="[...rules.item_required]"
                item-title="name"
                item-value="id"
                label="Kategori"
                prepend-inner-icon="mdi-shape"
              />
            </v-col>
            <v-col cols="7" class="ps-2">
              <v-autocomplete
              variant="underlined"
              v-model="payload.item.id"
              :items="dataItems"
              :loading="li"
              item-title="name"
              item-value="id"
              label="Nama Barang"
              :rules="rules.required"
              prepend-inner-icon="mdi-form-textbox"
              @update:model-value="updateItem(payload.item.id!), formRef.validate()"
            />
            </v-col>
          </v-row>
          <v-row no-gutters class="justify-center">
            <v-col cols="3" class="pe-2">
              <v-text-field
                v-model="unit"
                variant="underlined"
                disabled
                label="Satuan"
                :rules="rules.required"
                prepend-inner-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="7" class="ps-2 d-flex align-center">
              <v-number-input 
                v-model.number="payload.item.quantity"
                style="max-width: 8rem"
                inset
                control-variant="split"
                :label="'Jumlah' + (payload.status ? ' ' + payload.status : '')"
                variant="plain"
                :min="0"
                :rules="[...rules.qty, ...rules.item_required, ...rules.status_required]"
              ></v-number-input>
              <span class="text-subtitle-2 text-medium-emphasis" >
                <div>
                    Dari:
                </div>
                {{ payload.item.quantity + ' ' + unit }}
              </span>
            </v-col>
            <!-- expired -->
            <!-- <v-col cols="7">
              <v-text-field
                v-model="formatedDateExp"
                label="Tanggal Expired"
                prepend-inner-icon="mdi-calendar"
                readonly
                :active="datePickerMenuExp"
                :focused="datePickerMenuExp"
                variant="underlined"
                :rules="[...rules.required, ...rules.item_required]"
              />
              <v-dialog
                v-model="datePickerMenuExp"
                activator="parent"
                transition="scale-transition"
                offset-y
                max-width="290"
                min-width="290"
              >
                <v-date-picker
                  v-model="payload.expired_date"
                  @update:model-value="datePickerMenuExp = false"
                  :min="!isNewItem ? null : new Date()"
                  no-title
                  scrollable
                />
              </v-dialog>
            </v-col>  -->
          </v-row>

        </PerfectScrollbar>

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