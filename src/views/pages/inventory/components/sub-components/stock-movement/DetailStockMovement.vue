<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import { useInventoryItems } from '@/composables/useInventoryItems';
import type { CreateInventoryItemPayload, CreateStockMovementPayload, InventoryItem, StockMovement, UpdateInventoryItemPayload, UpdateStockMovementPayload } from '@/types/inventory';
import type { IdName } from '@/types/common';
import { formatDate } from '@/utils/helpers/format-date';
import { useStockMovements } from '@/composables/useStockMovement';

const { create, update, remove, loading } = useStockMovements()

const { openOverlay } = useOverlayManager()
const emit = defineEmits(['close'])

const props = defineProps<{
  data?: StockMovement;
  categories: IdName[]
  branches: IdName[]
  inv_item: InventoryItem[]
  is_create: boolean

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const payload = ref<{
  description: string | null,
  branch_id: string | null,
  status: 'Masuk' | 'Keluar' | 'Pengurangan' | null,
  time: Date | null,
  item: {
    id: string | null,
    category_id: string | null,
    quantity: number,
    unit: string
  },
  shift_warehouse: string | null,
}>({
  description: props.is_create ? null : props.data?.description ?? null,
  shift_warehouse: props.is_create ? null : props.data?.shift_warehouse ?? null,
  item: props.is_create ? {
    id: null,
    quantity: 0,
    unit: '',
    category_id: null
  } : {
    id: props.data?.item?.id ?? '',
    quantity: props.data?.item?.quantity ?? 0,
    unit: props.data?.item?.unit ?? '',
    category_id: props.data?.item?.category?.id ?? null
  },
  status: props.is_create ? null : props.data?.status ?? null,
  branch_id: props.is_create ? null : props.data?.branch?.id ?? null,
  time: props.is_create ? null : props.data?.time ?? null,
})

const formRef = ref()
const isFormValid = ref(false)

const dateMenu = ref(false)
const dateModel = ref<Date | null>(null);
const timeMenu = ref(false)
const timeModel = ref<string>('');
const isUpdatingTime = ref(false)

const isFromBranch = ref(false)
const isIn = ref(false)

const formatedDateTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(0, -12)
})
const formatedClockTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(-5)
})

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosong'],
  item_required: [(v: number) => payload.value.item.id !== null && payload.value.item.id !== "" || 'Pilih item terlebih dahulu'],
  status_required: [(v: string) => payload.value.status !== null || 'Pilih status terlebih dahulu'],
  qty: [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0'],
  desc: [(v: string) => v.length <= 100 || 'Maksimal 100 karakter'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.description !== null ||
      payload.value.shift_warehouse !== null ||
      payload.value.item?.id !== null ||
      payload.value.item?.quantity !== 0 ||
      payload.value.status !== null ||
      payload.value.branch_id !== null ||
      payload.value.time !== null
    )
  } else {
    return (
      payload.value.description !== props.data?.description ||
      payload.value.shift_warehouse !== props.data?.shift_warehouse ||
      payload.value.item?.id !== props.data?.item.id ||
      payload.value.item?.quantity !== props.data?.item.quantity ||
      payload.value.status !== props.data?.status ||
      payload.value.branch_id !== props.data?.branch?.id ||
      payload.value.time !== props.data?.time
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function onDatePicked(val: Date | null) {
  if (!val) return;

  if (!payload.value.time) payload.value.time = new Date()

  const time = payload.value.time

  payload.value.time = new Date(
    val.getFullYear(),
    val.getMonth(),
    val.getDate(),
    time.getHours(),
    time.getMinutes() 
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
    minutes
  )
  
  timeModel.value = ''
  timeMenu.value = false
}

function updateItem(id: string) {
  if (id) {
    // Cari item berdasarkan id barang yang dipilih
    const item = props.inv_item.find(item => item.id === id)
    if (item) {
      payload.value.item.unit = item.unit
    } else console.log('item not found')
  }
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
  })
}

async function processSubmit() {
  try {
    const createPayload: CreateStockMovementPayload = {
      branch_id: isFromBranch.value ? null : payload.value.branch_id!,
      item: {
        id: payload.value.item.id!,
        quantity: payload.value.item.quantity!
      },
      shift_warehouse: payload.value.shift_warehouse!,
      description: payload.value.description!,
      status: payload.value.status!,
      time: payload.value.time!,
    }

    if (props.is_create) {
      await create(createPayload)
      props.refresh()
    }
    else {
      const updatePayload: UpdateStockMovementPayload = {
        id: props.data!.id,
        ...createPayload
      }
      await update(updatePayload)
      props.refresh()
    }
    handleClose()
  } catch (error) {
    console.log(error)
    props.refresh()
    handleClose()
  }
}

async function processDelete() {
  try {
    await remove(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

function handleClose() {
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

</script>

<template>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn
      icon
      class="position-absolute"
      variant="text"
      style="top: 8px; right: 12px;" 
      :disabled="loading"
      @click="handleClose()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Buat Perpindahan Stok' : 'Ubah Perpindahan Stok' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ is_create ? '' : props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
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
                />
              </v-dialog>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters class="justify-space-between" align="center">
          <v-col :cols="payload.status === 'Masuk' ? '6' : '12'" class="pe-2">
            <v-select
              variant="underlined"
              v-model="payload.status"
              :items="['Masuk', 'Keluar', 'Pengurangan']"
              :rules="rules.required"
              label="Tipe"
              prepend-inner-icon="mdi-format-vertical-align-center"
              @update:model-value="
                isFromBranch = props.data?.item.is_new!,
                formRef.validate()
              "
            />
          </v-col>
          <v-col cols="6" class="ps-2">
            <v-btn
              v-if="payload.status === 'Masuk'"
              class="text-capitalize"
              :color="isFromBranch ? 'primary' : 'success'"
              variant="tonal"
              block
              :loading="loading"
              @click="isFromBranch = !isFromBranch"
            >
              {{ isFromBranch ? 'Dari Cabang' : 'Pengadaan' }} 
            </v-btn>
          </v-col>
          
          <v-col cols="12" v-if="isFromBranch || payload.status === 'Keluar'">
            <v-select
              variant="underlined"
              v-model="payload.branch_id"
              label="Cabang"
              :items="props.branches"
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
              :items="props.categories"
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
            :items="props.inv_item"
            item-title="name"
            item-value="id"
            label="Nama Barang"
            :rules="rules.required"
            prepend-inner-icon="mdi-form-textbox"
            @update:model-value="updateItem(payload.item.id!), formRef.validate()"
          />
          </v-col>
        </v-row>
        <v-row no-gutters class="justify-center" align="center">
          <v-col cols="3" class="pe-2">
            <v-text-field
              v-model="payload.item.unit"
              variant="underlined"
              disabled
              label="Satuan"
              :rules="rules.required"
              prepend-inner-icon="mdi-scale-balance"
            />
          </v-col>
          <v-col cols="6" class="ps-2">
            <v-number-input 
              v-model.number="payload.item.quantity"
              inset
              control-variant="split"
              :label="'Jumlah' + (payload.status ? ' ' + payload.status : '')"
              variant="plain"
              :min="0"
              :rules="[...rules.qty, ...rules.item_required, ...rules.status_required]"
            ></v-number-input>
          </v-col>
        </v-row>
      </PerfectScrollbar>

      <v-divider class="my-3" />
      
      <div>
        <div 
          class="d-flex align-center justify-end mt-1"
          :class="is_create ? 'justify-end' : 'justify-space-between'"
        >
          <!-- delete button -->
          <v-btn
            v-if="!is_create"
            variant="plain"
            class="mr-1 text-error"
            density="compact"
            :loading="loading"
            prepend-icon="mdi-delete"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin menghapus item ini?',
                  onConfirm: () => {
                    processDelete()
                  }
                }
              })
            "
          >
            Hapus
          </v-btn>

          <span>
            <v-btn
              class="ms-2"
              :color="payload.status === 'Keluar' || payload.status === 'Pengurangan' ? 'error' : payload.status === 'Masuk' ? isFromBranch ? 'primary' : 'success' : 'error'"
              :loading="loading"
              :disabled="!isFormValid || !isChanged || loading"
              @click="submitForm"
            >
              {{ is_create ? 'Buat' : 'Simpan' }}
            </v-btn>
          </span>
        </div>
      </div>
    </v-form>
  </v-card>
</template>