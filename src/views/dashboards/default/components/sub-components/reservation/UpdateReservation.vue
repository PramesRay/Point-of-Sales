<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import type { IdName } from '@/types/common';
import { formatDate } from '@/utils/helpers/format-date';
import type { Customer } from '@/types/customer';
import { useReservation } from '@/composables/useReservation';
import type { CreateReservationPayload, Reservation, UpdateReservationPayload } from '@/types/reservation';
import { useUserStore } from '@/stores/authUser';
import type { Branch } from '@/types/branch';

const {create, update, remove, loading} = useReservation()
const userStore = useUserStore()

const { openOverlay } = useOverlayManager()
const emit = defineEmits(['close'])

const props = defineProps<{
  data?: Reservation;
  branches: Branch[]
  is_create: boolean

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const payload = ref<{
  branch_id: string | null;
  customer: Customer;
  time: Date | null;
  status: 'Disetujui' | 'Pending' | 'Ditolak' | null;
  notes: string;
  people: number
}>({
  branch_id: !props.is_create ? props.data?.branch.id! : userStore.me?.branch?.id || null,
  customer: !props.is_create ? props.data?.customer! : { name: userStore.me?.name || '', phone: userStore.me?.phone || '' },
  time: !props.is_create ? props.data?.time! : null,
  status: !props.is_create ? props.data?.status! : null,
  notes: !props.is_create ? props.data?.notes! : '',
  people: !props.is_create ? props.data?.people! : 0
})

const formRef = ref()
const isFormValid = ref(false)

const dateMenu = ref(false)
const dateModel = ref<Date | null>(null);
const timeMenu = ref(false)
const timeModel = ref<string>('');
const isUpdatingTime = ref(false)

const minTime = computed(() => {
  const now = new Date()
  if(payload.value.time?.getDate() === now.getDate()) {
    if(now.getHours() < 17) {
      return '17:00'
    } else {
      return (now.getHours()+2) + ':00'
    }
  } else {
    return '17:00'
  }
})

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
  phone: [(v: string) => v.length <= 15 || 'Nomor telepon maksimal 15 digit'],
  people: [(v: number) => v >= 4 || 'Jumlah minimal 4 orang', (v: number) => v <= 20 || 'Jumlah maksimal 20 orang'],
  notes: [(v: string) => v.length <= 100 || 'Catatan maksimal 100 karakter'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.branch_id !== (userStore.me?.branch?.id || null) ||
      payload.value.customer.name !== (userStore.me?.name || '') ||
      payload.value.customer.phone !== (userStore.me?.name || '') ||
      payload.value.time !== null ||
      payload.value.status !== null ||
      payload.value.notes !== '' ||
      payload.value.people !== null
    )
  } else {
    return (
      payload.value.branch_id !== props.data?.branch.id ||
      payload.value.customer.name !== props.data?.customer.name ||
      payload.value.customer.phone !== props.data?.customer.phone ||
      payload.value.time !== props.data?.time ||
      payload.value.status !== props.data?.status ||
      payload.value.notes !== props.data?.notes ||
      payload.value.people !== props.data?.people
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

function handleClose() {
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

function processDelete() {
  try {
    remove(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

function handleSubmit() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    const createPayload: CreateReservationPayload = {
      branch_id: payload.value.branch_id!,
      customer: payload.value.customer,
      time: payload.value.time!,
      notes: payload.value.notes,
      people: payload.value.people!
    }
    if (props.is_create) {
      create(createPayload).then(() => {
        props.refresh()
        handleClose()
      })
      
    } else {
      const updatePayload: UpdateReservationPayload = {
        id: props.data!.id,
        status: payload.value.status!,
        ...createPayload
      }
      update(updatePayload).then(() => {
        props.refresh()
        handleClose()
      })
    }
  })
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

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="payload.branch_id"
            label="Cabang"
            :items="props.branches"
            item-title="name"
            item-value="id"
            variant="underlined"
            prepend-icon="mdi-home"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-if="payload.customer"
            v-model="payload.customer.name"
            label="Nama"
            variant="underlined"
            prepend-icon="mdi-account-group"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="6">
          <v-number-input 
            control-variant="split"
            v-model="payload.people"
            label="Jumlah Orang"
            variant="plain"
            max-width="14rem"
            :rules="rules.people"
            :min="0"
            :max="20"
            inset
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            hide-spin-buttons
            v-if="payload.customer"
            v-model="payload.customer.phone"
            label="Nomor Telepon"
            variant="underlined"
            prepend-icon="mdi-phone"
            :rules="rules.required || rules.phone"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formatedDateTime"
            label="Tanggal Reservasi"
            prepend-icon="mdi-calendar"
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
                :max="new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()"
                :min="props.is_create ? new Date().toLocaleDateString() : null"
                no-title
                scrollable
              />
          </v-dialog>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formatedClockTime"
            label="Waktu Reservasi"
            prepend-icon="mdi-clock-outline"
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
                :max="props.branches.find(b => b.id === payload.branch_id)?.operational.close_time || '22:59'"
                :min="props.branches.find(b => b.id === payload.branch_id)?.operational.open_time || '17:00'"
                @update:model-value="onTimePicked"
              />
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="payload.notes"
            label="Catatan"
            rows="3"
            class="small-font"
            auto-grow
            prepend-inner-icon="mdi-text-long"
            clear-icon="mdi-close"
            :rules="rules.notes"
            clearable
            counter
          />
        </v-col>
      </v-row>

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
                  confirmMessage: 'Apakah anda yakin ingin menghapus reservasi ini?',
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
              :color="is_create ? 'success' : 'primary'"
              :loading="loading"
              :disabled="!isFormValid || !isChanged || loading"
              type="submit"
            >
              {{ is_create ? 'Buat' : 'Simpan' }}
            </v-btn>
          </span>
        </div>
      </div>      
    </v-form>
  </v-card>
</template>