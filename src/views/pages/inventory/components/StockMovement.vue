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
const itemQuantity = ref(0)

const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)
const showOverlay = ref(false)
const isManuallySaving = ref(false)

// Payload
const dataMovement = ref<{[K in keyof Omit<StockMovement, 'meta'>]: StockMovement[K] | null}>({
  id: null,
  description: null,
  branch: {
    id: '',
    name: ''
  },
  status: null,
  time: new Date(),
  item: {
    id: '',
    name: '',
    description: '',
    category: {
      id: '',
      name: ''
    },
    expired_date: new Date(),
    purchase_price: 0,
    unit: '',
    quantity: 0,
    threshold: 0,
    meta: {
      created_at: new Date(),
      updated_at: new Date()
    }
  }
})

// Form Rules
const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosong'],
  required_obj: [(v: { id: string; name: string }) => !!v.id  || 'Data tidak boleh kosong'],
  qty: [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0'],
  desc: [(v: string) => v.length <= 100 || 'Maksimal 100 karakter'],
}

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data
  return props.data.filter(item => item.item.category?.id === selectedCtg.value)
})

const isChanged = computed(() => {
  if (!dataMovement.value) return false

  if (isNewItem.value) {
    return (
      dataMovement.value.description !== null ||
      dataMovement.value.status !== null ||
      dataMovement.value.branch !== null ||
      dataMovement.value.item !== null ||
      dataMovement.value.time !== null
    )
  } else {
    if (!selectedItem.value) return false
    return (
      dataMovement.value.description !== selectedItem.value.description ||
      dataMovement.value.status !== selectedItem.value.status ||
      dataMovement.value.branch !== selectedItem.value.branch ||
      dataMovement.value.item !== selectedItem.value.item ||
      new Date(dataMovement.value.time!).getTime() !== new Date(selectedItem.value.time!).getTime()
    )
  }
})

// Format Date untuk time dan exp
const formatedDateTime = computed(() => {
  if (!dataMovement.value.time) return ''
  return formatDate(dataMovement.value.time).slice(0, -12)
})
const formatedClockTime = computed(() => {
  if (!dataMovement.value.time) return ''
  return formatDate(dataMovement.value.time).slice(-5)
})
const formatedDateExp = computed(() => {
  if (!dataMovement.value.item?.expired_date) return ''
  return formatDate(dataMovement.value.item.expired_date).slice(0, -12)
})

// Handler saat pilih tanggal
function onDatePicked(val: Date | null) {
  if (!val) return;

  if (!dataMovement.value.time) dataMovement.value.time = new Date()

  const time = dataMovement.value.time

  dataMovement.value.time = new Date(
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
  if (!dataMovement.value.time) {
    dataMovement.value.time = new Date()
  }

  const oldDate = dataMovement.value.time
  const [hours, minutes] = val.split(':').map(Number) 
  dataMovement.value.time = new Date(
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
  dataMovement.value = {
    id: null,
    description: null,
    branch: null,
    time: new Date(),
    item: {
      id: '',
      name: '',
      description: '',
      category: {
        id: '',
        name: ''
      },
      expired_date: new Date(),
      purchase_price: 0,
      unit: '',
      quantity: 0,
      threshold: 0,
      meta: {
        created_at: new Date(),
        updated_at: new Date()
      }
    },
    status: null
  }

  timeModel.value = ''
  dateModel.value = null
  isUpdatingTime.value = false
  itemQuantity.value = 0
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
  if (!dataMovement.value) return

  console.log('data movement before', dataMovement.value)

  const payload: CreateStockMovementPayload = JSON.parse(JSON.stringify({
    description: dataMovement.value.description!,
    time: dataMovement.value.time!,
    item: dataMovement.value.item!,
    status: dataMovement.value.status!,
    category_id: dataMovement.value.item?.category.id!,
    branch_id: dataMovement.value.branch?.id!
  }))

  const updatePayload: UpdateStockMovementPayload = JSON.parse(JSON.stringify({
    id: selectedItem.value?.id!,
    ...payload
  }))

  if (isNewItem.value) {
    emit('create-sm', (payload))
    console.log('Membuat item baru:', payload)
  } else {
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
    dataMovement.value = {
      id: selectedItem.value.id,
      description: selectedItem.value.description ?? null,
      branch: selectedItem.value.branch ?? null,
      item: selectedItem.value.item ?? null,
      time: selectedItem.value.time ?? null,
      status: selectedItem.value.status ?? null
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
      dataMovement.value.item = cloneDeep(item)
      itemQuantity.value = item.quantity

      dataMovement.value.item.quantity = 0
      if (dataMovement.value.item?.category.id == 'new') {
        dataMovement.value.item.category = {
          id: '',
          name: ''
        }
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
    dataMovement.value = {
      id: val.id,
      description: val.description ?? null,
      branch: val.branch ?? null,
      item: val.item ?? null,
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
                    :max="dataMovement.time?.toLocaleDateString() === new Date().toLocaleDateString() ? new Date().toTimeString().slice(0, 5) : '23:59'"
                  />
                </v-dialog>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="justify-space-between">
            <v-col cols="6" class="pe-2">
              <v-select
                variant="underlined"
                v-model="dataMovement.status"
                :items="['Masuk', 'Keluar', 'Penyesuaian']"
                :rules="rules.required"
                label="Tipe"
                prepend-inner-icon="mdi-format-vertical-align-center"
              />
            </v-col>
            <v-col cols="6" class="ps-2">
              <v-select
                variant="underlined"
                v-model="dataMovement.branch"
                label="Cabang"
                :items="branches"
                :rules="rules.required"
                item-title="name"
                item-value="id"
                prepend-inner-icon="mdi-home"
                return-object 
              />
            </v-col>
          </v-row>
          
          <div>
            <v-textarea
              variant="underlined"
              v-model="dataMovement.description"
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
                v-model="dataMovement.item.category"
                :items="editableCategories"
                :rules="rules.required_obj"
                :disabled="dataMovement.item.id == ''"
                item-title="name"
                item-value="id"
                label="Kategori"
                prepend-inner-icon="mdi-shape"
                return-object 
              />
            </v-col>
            <v-col cols="7" class="ps-2">
              <v-autocomplete
              variant="underlined"
              v-model="dataMovement.item.id"
              @update:model-value="updateItem(dataMovement.item.id)"
              :items="dataItems"
              :loading="li"
              item-title="name"
              item-value="id"
              label="Nama Barang"
              :rules="rules.required"
              prepend-inner-icon="mdi-form-textbox"
            />
            </v-col>
          </v-row>
          <v-row no-gutters class="justify-center">
            <v-col cols="3" class="pe-2">
              <v-text-field
                variant="underlined"
                v-model="dataMovement.item.unit"
                disabled
                label="Satuan"
                :rules="rules.required"
                prepend-inner-icon="mdi-scale-balance"
              />
            </v-col>
            <v-col cols="7" class="ps-2 d-flex align-center">
              <v-number-input 
                style="max-width: 8rem"
                inset
                control-variant="split"
                v-model.number="dataMovement.item.quantity"
                :label="'Jumlah' + (dataMovement.status ? ' ' + dataMovement.status : '')"
                variant="plain"
                :min="0"
                :rules="rules.qty"
                :disabled="dataMovement.item.id == '' || !dataMovement.status"
              ></v-number-input>
              <span class="text-subtitle-2 text-medium-emphasis" >
                <div>
                    Dari:
                </div>
                {{ itemQuantity + ' ' + dataMovement.item.unit}}
              </span>
            </v-col>
            <!-- expired -->
            <v-col cols="7">
              <v-text-field
                v-model="formatedDateExp"
                label="Tanggal Expired"
                prepend-inner-icon="mdi-calendar"
                readonly
                :active="datePickerMenuExp"
                :focused="datePickerMenuExp"
                variant="underlined"
                :rules="rules.required"
                :disabled="dataMovement.item.id == ''"
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
                    v-model="dataMovement.item.expired_date"
                    @update:model-value="datePickerMenuExp = false"
                    :min="!isNewItem ? null : new Date()"
                    no-title
                    scrollable
                  />
              </v-dialog>
            </v-col> 
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